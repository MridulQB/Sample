import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Error "mo:base/Error";
import Random "mo:base/Random";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import OrderedMap "mo:base/OrderedMap";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Float "mo:base/Float";

persistent actor BudgetTracker {
    type Role = { #Admin; #Editor };
    type User = {
        principal : Principal;
        role : Role;
        joinedAt : Time.Time;
    };
    type Category = Text;
    type PaymentMethod = Text;
    type TransactionId = Nat;
    type Transaction = {
        id : TransactionId;
        owner : Principal;
        date : Time.Time;
        amount : Nat;
        category : Category;
        paymentMethod : PaymentMethod;
        notes : ?Text;
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };
    type Budget = {
        category : Category;
        amount : Nat;
        updatedAt : Time.Time;
    };
    type InviteToken = Text;
    type Invite = {
        token : InviteToken;
        createdBy : Principal;
        createdAt : Time.Time;
        expiresAt : Time.Time;
        usedBy : ?Principal;
    };
    type AddTransactionResponse = {
        #success;
        #categoryEmpty;
        #paymentMethodEmpty;
    };
    type UpdateTransactionResponse = {
        #success;
        #categoryEmpty;
        #paymentMethodEmpty;
        #invalidTxn;
    };
    type DeleteTransactionResponse = {
        #success;
        #invalidTxn;
    };
    type SetBudgetResponse = {
        #success;
        #categoryEmpty;
    };
    type DeleteBudgetResponse = {
        #success;
        #invalidCategory;
    };
    type InvitationResponse = {
        #alreadyRegistered;
        #invalidToken;
        #alreadyUsedToken;
        #expiredToken;
        #success;
    };
    type RevokeAccessResponse = {
        #unauthorizedActivity;
        #invalidUser;
        #success;
    };
    type GenerateInviteLinkResponse = {
        #success;
        #failed;
    };
    type CategorySummary = {
        category: Category;
        spent: Int;
        budget: ?Nat;
        percentage: Float;
    };
    type PaymentMethodSummary = {
        method: PaymentMethod;
        spent: Int;
        count: Nat;
    };
    type SpendingTrend = {
        period: Text; // YYYY-MM
        spent: Int;
    };
    type UserProfile = {
        preferredCurrency: Text;
        theme: Text;
        notificationsEnabled: Bool;
    };
    type NotificationSettings = {
        budgetWarningThreshold: Nat; // Percentage 0-100
        emailNotifications: Bool;
        browserNotifications: Bool;
    };
    type UpdateProfileResponse = {
        #success;
        #invalidUser;
    };
    type CategoryAction = {
        #add;
        #delete;
    };
    type CategoryResponse = {
        #success;
        #invalidCategory;
        #categoryExists;
    };
    type PaymentMethodResponse = {
        #success;
        #invalidMethod;
        #methodExists;
    };
    
    // User transaction type to store user's transactions
    type UserTransactions = OrderedMap.Map<TransactionId, Transaction>;

    var nextTransactionId : TransactionId = 0;
    var adminPrincipalOpt : ?Principal = null;

    transient let usersMap = OrderedMap.Make<Principal>(Principal.compare);
    transient let transactionMap = OrderedMap.Make<TransactionId>(Nat.compare);
    transient let budgetMap = OrderedMap.Make<Category>(Text.compare);
    transient let inviteMap = OrderedMap.Make<InviteToken>(Text.compare);
    transient let userTransactionMap = OrderedMap.Make<Principal>(Principal.compare);
    
    var users : OrderedMap.Map<Principal, User> = usersMap.empty<User>();
    var transactions : OrderedMap.Map<TransactionId, Transaction> = transactionMap.empty<Transaction>();
    var budgets : OrderedMap.Map<Category, Budget> = budgetMap.empty<Budget>();
    var invites : OrderedMap.Map<InviteToken, Invite> = inviteMap.empty<Invite>();
    var categories: OrderedMap.Map<Category, Time.Time> = budgetMap.empty<Time.Time>();
    var paymentMethods: OrderedMap.Map<PaymentMethod, Time.Time> = budgetMap.empty<Time.Time>();
    var userProfiles: OrderedMap.Map<Principal, UserProfile> = usersMap.empty<UserProfile>();
    var notificationSettings: OrderedMap.Map<Principal, NotificationSettings> = usersMap.empty<NotificationSettings>();
    var userTransactions: OrderedMap.Map<Principal, UserTransactions> = userTransactionMap.empty<UserTransactions>();
    
    // Authorization helpers
    func initializeAdmin(principal : Principal) {
        if (adminPrincipalOpt == null and usersMap.size(users) == 0) {
            let newUser : User = {
                principal = principal;
                role = #Admin;
                joinedAt = Time.now();
            };
            users := usersMap.put(users, principal, newUser);
            adminPrincipalOpt := ?principal;
            
            // Initialize admin's transaction store
            userTransactions := userTransactionMap.put(userTransactions, principal, transactionMap.empty<Transaction>());
        };
    };

    func isAdmin(principal : Principal) : Bool {
        let ?user = usersMap.get(users, principal) else return false;
        user.role == #Admin;
    };

    func isAuthorized(principal: Principal): Bool {
        switch (usersMap.get(users, principal)) {
            case (?_) { true };
            case null { false };
        };
    };

    func _canEditTransaction(caller: Principal, txId: TransactionId): Bool {
        switch (transactionMap.get(transactions, txId)) {
            case (?tx) {
                if (isAdmin(caller)) { return true; };
                return Principal.equal(tx.owner, caller);
            };
            case null { false };
        };
    };

    public shared ({ caller }) func assertAdmin() : async () {
        initializeAdmin(caller);
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
    };

    // Token generation for invites
    func toHex(n : Nat8) : Text {
        let hexChars = Iter.toArray(Text.toIter("0123456789abcdef"));
        let high = n / 16;
        let low = n % 16;
        let highChar : Char = hexChars[Nat8.toNat(high)];
        let lowChar : Char = hexChars[Nat8.toNat(low)];
        Text.fromChar(highChar) # Text.fromChar(lowChar);
    };

    func generateRandomToken() : async InviteToken {
        let blob : Blob = await Random.blob();
        let byteArray : [Nat8] = Blob.toArray(blob);
        let hexArray : [Text] = Array.map<Nat8, Text>(byteArray, toHex);
        let token : Text = Text.join("", Iter.fromArray(hexArray));
        token;
    };

    // Transaction Management
    public query func getTransaction(id : TransactionId) : async ?Transaction {
        transactionMap.get(transactions, id);
    };

    // Get user's transactions
    public query ({ caller }) func getUserTransactionsByCaller() : async [(TransactionId, Transaction)] {
        if (not isAuthorized(caller)) throw Error.reject("Access Denied: Not authorized");
        
        let ?userTxMap = userTransactionMap.get(userTransactions, caller) else {
            return [];
        };
        
        var result : [(TransactionId, Transaction)] = Iter.toArray(transactionMap.entries(userTxMap));
        result := Array.sort<(TransactionId, Transaction)>(
            result,
            func((_, aTx), (_, bTx)) {
                if (aTx.date > bTx.date) return #less else if (aTx.date < bTx.date) return #greater else return #equal;
            },
        );
        result;
    };

    public query func getUserTransactionsByPrincipal(userPrincipal : Principal) : async [(TransactionId, Transaction)] {
        if (not isAuthorized(userPrincipal)) throw Error.reject("Access Denied: Not authorized");
        
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return [];
        };
        
        var result : [(TransactionId, Transaction)] = Iter.toArray(transactionMap.entries(userTxMap));
        result := Array.sort<(TransactionId, Transaction)>(
            result,
            func((_, aTx), (_, bTx)) {
                if (aTx.date > bTx.date) return #less else if (aTx.date < bTx.date) return #greater else return #equal;
            },
        );
        result;
    };

    public query func getAllTransactions() : async [(TransactionId, Transaction)] {
        var result : [(TransactionId, Transaction)] = Iter.toArray(transactionMap.entries(transactions));
        result := Array.sort<(TransactionId, Transaction)>(
            result,
            func((_, aTx), (_, bTx)) {
                if (aTx.date > bTx.date) return #less else if (aTx.date < bTx.date) return #greater else return #equal;
            },
        );
        result;
    };

    public query func getFilteredTransactions(
        startDate : ?Time.Time,
        endDate : ?Time.Time,
        minAmount : ?Int,
        maxAmount : ?Int,
        category : ?Category,
        paymentMethod : ?PaymentMethod,
    ) : async [(TransactionId, Transaction)] {
        var filtered : [(TransactionId, Transaction)] = [];
        for ((id, tx) in transactionMap.entries(transactions)) {
            var include = true;
            switch (startDate) {
                case (?start) if (tx.date < start) include := false;
                case null {};
            };
            switch (endDate) {
                case (?end) if (include and tx.date > end) include := false;
                case null {};
            };
            switch (minAmount) {
                case (?min) if (include and tx.amount < min) include := false;
                case null {};
            };
            switch (maxAmount) {
                case (?max) if (include and tx.amount > max) include := false;
                case null {};
            };
            switch (category) {
                case (?cat) if (include and tx.category != cat) include := false;
                case null {};
            };
            switch (paymentMethod) {
                case (?method) if (include and tx.paymentMethod != method) include := false;
                case null {};
            };
            if (include) {
                filtered := Array.append([(id, tx)], filtered);
            };
        };
        filtered;
    };

    public shared ({ caller }) func addTransaction(
        date : Time.Time,
        amount : Nat,
        category : Category,
        paymentMethod : PaymentMethod,
        notes : ?Text,
    ) : async AddTransactionResponse {
        if (not isAuthorized(caller)) throw Error.reject("Access Denied: Not authorized");
        
        let now = Time.now();
        let newId = nextTransactionId;
        if (Text.size(category) == 0) return #categoryEmpty;
        if (Text.size(paymentMethod) == 0) return #paymentMethodEmpty;
        let newTransaction : Transaction = {
            id = newId;
            owner = caller;
            date = date;
            amount = amount;
            category = category;
            paymentMethod = paymentMethod;
            notes = notes;
            createdAt = now;
            updatedAt = now;
        };
        
        // Add to global transactions
        transactions := transactionMap.put(transactions, newId, newTransaction);
        
        // Add to user's transactions
        var userTxMap = switch (userTransactionMap.get(userTransactions, caller)) {
            case (?existingMap) { existingMap };
            case null { transactionMap.empty<Transaction>() };
        };
        userTxMap := transactionMap.put(userTxMap, newId, newTransaction);
        userTransactions := userTransactionMap.put(userTransactions, caller, userTxMap);
        
        nextTransactionId += 1;
        
        // Add category and payment method if they don't exist
        if (budgetMap.get(categories, category) == null) {
            categories := budgetMap.put(categories, category, now);
        };
        if (budgetMap.get(paymentMethods, paymentMethod) == null) {
            paymentMethods := budgetMap.put(paymentMethods, paymentMethod, now);
        };
        
        #success;
    };

    public shared({ caller }) func updateTransaction(
        id : TransactionId,
        date : Time.Time,
        amount : Nat,
        category : Category,
        paymentMethod : PaymentMethod,
        notes : ?Text,
    ) : async UpdateTransactionResponse {
        if(not isAdmin(caller)) throw Error.reject("Access Denied: Cannot edit this transaction.");
        
        let now = Time.now();
        if (Text.size(category) == 0) return #categoryEmpty;
        if (Text.size(paymentMethod) == 0) return #paymentMethodEmpty;
        
        let ?oldTransaction = transactionMap.get(transactions, id) else return #invalidTxn;
        let updatedTransaction : Transaction = {
            id = oldTransaction.id;
            owner = oldTransaction.owner;
            createdAt = oldTransaction.createdAt;
            date = date;
            amount = amount;
            category = category;
            paymentMethod = paymentMethod;
            notes = notes;
            updatedAt = now;
        };
        
        // Update in global transactions
        transactions := transactionMap.put(transactions, id, updatedTransaction);
        
        // Update in owner's transactions
        let ownerPrincipal = oldTransaction.owner;
        switch (userTransactionMap.get(userTransactions, ownerPrincipal)) {
            case (?userTxMap) {
                let updatedUserTxMap = transactionMap.put(userTxMap, id, updatedTransaction);
                userTransactions := userTransactionMap.put(userTransactions, ownerPrincipal, updatedUserTxMap);
            };
            case null {
                // If owner's transaction map doesn't exist (shouldn't happen), create it
                var newUserTxMap = transactionMap.empty<Transaction>();
                newUserTxMap := transactionMap.put(newUserTxMap, id, updatedTransaction);
                userTransactions := userTransactionMap.put(userTransactions, ownerPrincipal, newUserTxMap);
            };
        };
        
        // Add category and payment method if they don't exist
        if (budgetMap.get(categories, category) == null) {
            categories := budgetMap.put(categories, category, now);
        };
        if (budgetMap.get(paymentMethods, paymentMethod) == null) {
            paymentMethods := budgetMap.put(paymentMethods, paymentMethod, now);
        };
        
        #success;
    };

    public shared({ caller }) func deleteTransaction(id : TransactionId) : async DeleteTransactionResponse {
        if(not isAdmin(caller)) throw Error.reject("Access Denied: Cannot delete this transaction.");
        
        let ?tx = transactionMap.get(transactions, id) else return #invalidTxn;
        
        // Remove from global transactions
        transactions := transactionMap.delete(transactions, id);
        
        // Remove from owner's transactions
        let ownerPrincipal = tx.owner;
        switch (userTransactionMap.get(userTransactions, ownerPrincipal)) {
            case (?userTxMap) {
                let updatedUserTxMap = transactionMap.delete(userTxMap, id);
                userTransactions := userTransactionMap.put(userTransactions, ownerPrincipal, updatedUserTxMap);
            };
            case null { /* No user transactions map, nothing to delete */ };
        };
        
        #success;
    };

    // Budget Management
    public query func getBudgets() : async [(Category, Budget)] {
        var result : [(Category, Budget)] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) result := Array.append([(cat, budget)], result);
        result := Array.sort<(Category, Budget)>(
            result,
            func((catA, _), (catB, _)) {
                Text.compare(catA, catB);
            },
        );
        result;
    };

    public query func getBudgetSummary() : async [(Category, Nat, Int, Nat)] {
        let now = Time.now();
        let approxMonthNanos : Nat = 30 * 24 * 60 * 60 * 1_000_000_000;
        let startOfMonthApprox : Time.Time = if (now < approxMonthNanos) 0 else now - approxMonthNanos;
        var spending = Map.HashMap<Category, Int>(0, Text.equal, Text.hash);
        for ((_, tx) in transactionMap.entries(transactions)) {
            if (tx.date >= startOfMonthApprox and tx.amount < 0) {
                let currentSpending = Option.get(spending.get(tx.category), 0);
                spending.put(tx.category, currentSpending + tx.amount);
            };
        };
        var summary : [(Category, Nat, Int, Nat)] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            let spent = Option.get(spending.get(cat), 0);
            let remaining : Nat = if ((-spent) >= budget.amount) 0 else budget.amount - Int.abs(spent);
            summary := Array.append([(cat, budget.amount, spent, remaining)], summary);
        };
        summary := Array.sort<(Category, Nat, Int, Nat)>(
            summary,
            func((catA, _, _, _), (catB, _, _, _)) {
                Text.compare(catA, catB);
            },
        );
        summary;
    };

    public shared({ caller }) func setBudget(category : Category, amount : Nat) : async SetBudgetResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        if (Text.size(category) == 0) return #categoryEmpty;
        let now = Time.now();
        let newBudget : Budget = {
            category = category;
            amount = amount;
            updatedAt = now;
        };
        budgets := budgetMap.put(budgets, category, newBudget);
        
        // Also ensure the category exists
        if (budgetMap.get(categories, category) == null) {
            categories := budgetMap.put(categories, category, now);
        };
        
        #success;
    };

    public shared({ caller }) func deleteBudget(category : Category) : async DeleteBudgetResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        if (budgetMap.get(budgets, category) == null) return #invalidCategory;
        budgets := budgetMap.delete(budgets, category);
        #success;
    };

    // User Management
    public query func getUsers() : async [User] {
        var result : [User] = [];
        for ((_, user) in usersMap.entries(users)) {
            result := Array.append([user], result);
        };
        result;
    };

    public shared ({ caller }) func generateInviteLink() : async GenerateInviteLinkResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        let now : Time.Time = Time.now();
        let expiryNanos : Nat = 24 * 60 * 60 * 1_000_000_000;
        let expiresAt : Time.Time = now + Int.abs(expiryNanos);
        var token : InviteToken = "";
        var attempts = 0;
        let maxAttempts = 10;
        label loopLabel while (true) {
            if (attempts >= maxAttempts) return #failed;
            let generated : InviteToken = await generateRandomToken();
            if (inviteMap.get(invites, generated) == null) {
                token := generated;
                break loopLabel;
            };
            attempts += 1;
        };
        let newInvite : Invite = {
            token = token;
            createdBy = caller;
            createdAt = now;
            expiresAt = expiresAt;
            usedBy = null;
        };
        invites := inviteMap.put(invites, token, newInvite);
        #success;
    };

    public shared ({ caller }) func acceptInvite(token : InviteToken) : async InvitationResponse {
        let now = Time.now();
        if (usersMap.get(users, caller) != null) return #alreadyRegistered;
        let ?invite = inviteMap.get(invites, token) else return #invalidToken;
        if (invite.usedBy != null) return #alreadyUsedToken;
        if (now > invite.expiresAt) {
            invites := inviteMap.delete(invites, token);
            return #expiredToken;
        };
        let updatedInvite : Invite = {
            token = invite.token;
            createdBy = invite.createdBy;
            createdAt = invite.createdAt;
            expiresAt = invite.expiresAt;
            usedBy = ?caller;
        };
        invites := inviteMap.put(invites, token, updatedInvite);
        let newUser : User = {
            principal = caller;
            role = #Editor;
            joinedAt = now;
        };
        users := usersMap.put(users, caller, newUser);
        
        // Initialize user's transaction store
        userTransactions := userTransactionMap.put(userTransactions, caller, transactionMap.empty<Transaction>());
        
        let defaultProfile : UserProfile = {
            preferredCurrency = "USD";
            theme = "light";
            notificationsEnabled = true;
        };
        userProfiles := usersMap.put(userProfiles, caller, defaultProfile);
        
        // Initialize notification settings with defaults
        let defaultNotificationSettings : NotificationSettings = {
            budgetWarningThreshold = 80; // 80% of budget
            emailNotifications = false;
            browserNotifications = true;
        };
        notificationSettings := usersMap.put(notificationSettings, caller, defaultNotificationSettings);
        
        #success;
    };

    public shared ({ caller }) func revokeAccess(userPrincipal : Principal) : async RevokeAccessResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        if (userPrincipal == caller) return #unauthorizedActivity;
        if (usersMap.get(users, userPrincipal) == null) return #invalidUser;
        
        // Remove user
        users := usersMap.delete(users, userPrincipal);
        
        // Clean up user's transaction map
        userTransactions := userTransactionMap.delete(userTransactions, userPrincipal);
        
        // Clean up user profile and settings
        userProfiles := usersMap.delete(userProfiles, userPrincipal);
        notificationSettings := usersMap.delete(notificationSettings, userPrincipal);
        
        #success;
    };

    // User Profile Management
    public shared({ caller }) func setUserProfile(profile: UserProfile): async UpdateProfileResponse {
        if (not isAuthorized(caller)) return #invalidUser;
        
        userProfiles := usersMap.put(userProfiles, caller, profile);
        #success;
    };

    public query({ caller }) func getUserProfileByCaller(): async ?UserProfile {
        usersMap.get(userProfiles, caller);
    };

    public query func getUserProfileByPrincipal(userPrincipal : Principal): async ?UserProfile {
        usersMap.get(userProfiles,userPrincipal);
    };

    // Budget Notification Settings
    public shared({ caller }) func setNotificationSettings(settings: NotificationSettings): async UpdateProfileResponse {
        if (not isAuthorized(caller)) return #invalidUser;
        
        notificationSettings := usersMap.put(notificationSettings, caller, settings);
        #success;
    };

    public query({ caller }) func getNotificationSettingsNyCaller(): async ?NotificationSettings {
        usersMap.get(notificationSettings, caller);
    };

    public query func getNotificationSettingsByPrincipal(userPrincipal : Principal): async ?NotificationSettings {
        usersMap.get(notificationSettings, userPrincipal);
    };

    // Check budget status for notifications
    public func checkBudgetStatus(): async [(Category, Nat, Int, Nat, Bool)] {
        let budgetSummary = await getBudgetSummary();
        let result = Array.map<(Category, Nat, Int, Nat), (Category, Nat, Int, Nat, Bool)>(
            budgetSummary,
            func(entry: (Category, Nat, Int, Nat)): (Category, Nat, Int, Nat, Bool) {
                let (category, budget, spent, remaining) = entry;
                // Alert if less than 100 remaining or exceeded
                let alertNeeded = remaining < 100;
                (category, budget, spent, remaining, alertNeeded);
            }
        );
        result;
    };

    // Category Management
    public shared({ caller }) func manageCategory(category: Category, action: CategoryAction): async CategoryResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        switch(action) {
            case (#add) {
                if (budgetMap.get(categories, category) != null) {
                    return #categoryExists;
                };
                categories := budgetMap.put(categories, category, Time.now());
                #success;
            };
            case (#delete) {
                if (budgetMap.get(categories, category) == null) {
                    return #invalidCategory;
                };
                categories := budgetMap.delete(categories, category);
                if (budgetMap.get(budgets, category) != null) {
                    budgets := budgetMap.delete(budgets, category);
                };
                #success;
            };
        };
    };

    public query func getCategories(): async [Category] {
        var result: [Category] = [];
        for ((cat, _) in budgetMap.entries(categories)) {
            result := Array.append([cat], result);
        };
        result := Array.sort<Category>(result, Text.compare);
        result;
    };

    // Payment Method Management
    public shared({ caller }) func addPaymentMethod(method: PaymentMethod): async PaymentMethodResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        if (budgetMap.get(paymentMethods, method) != null) {
            return #methodExists;
        };
        paymentMethods := budgetMap.put(paymentMethods, method, Time.now());
        #success;
    };

    public shared({ caller }) func deletePaymentMethod(method: PaymentMethod): async PaymentMethodResponse {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        if (budgetMap.get(paymentMethods, method) == null) {
            return #invalidMethod;
        };
        paymentMethods := budgetMap.delete(paymentMethods, method);
        #success;
    };

    public query func getPaymentMethods(): async [PaymentMethod] {
        var result: [PaymentMethod] = [];
        for ((method, _) in budgetMap.entries(paymentMethods)) {
            result := Array.append([method], result);
        };
        result := Array.sort<PaymentMethod>(result, Text.compare);
        result;
    };

    // Get transactions for a specific user (admin function)
    public shared({ caller }) func getTransactionsByUser(userPrincipal: Principal): async [(TransactionId, Transaction)] {
        if (not isAdmin(caller)) throw Error.reject("Access Denied: Admin role required.");
        
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return [];
        };
        
        var result : [(TransactionId, Transaction)] = Iter.toArray(transactionMap.entries(userTxMap));
        result := Array.sort<(TransactionId, Transaction)>(
            result,
            func((_, aTx), (_, bTx)) {
                if (aTx.date > bTx.date) return #less else if (aTx.date < bTx.date) return #greater else return #equal;
            },
        );
        result;
    };

    // Analytics endpoints for visualization
    public query func getCategorySummary(
        startDate: ?Time.Time,
        endDate: ?Time.Time
    ): async [CategorySummary] {
        let now = Time.now();
        let startTime = Option.get(startDate, now - 30 * 24 * 60 * 60 * 1_000_000_000); // Default 30 days
        let endTime = Option.get(endDate, now);
        
        var categorySpending = Map.HashMap<Category, Int>(0, Text.equal, Text.hash);
        
        // Calculate spending by category
        for ((_, tx) in transactionMap.entries(transactions)) {
            if (tx.date >= startTime and tx.date <= endTime) {
                let currentSpent = Option.get(categorySpending.get(tx.category), 0);
                categorySpending.put(tx.category, currentSpent + tx.amount);
            };
        };
        
        var result: [CategorySummary] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            let spent = Option.get(categorySpending.get(cat), 0);
            let percentage = if (budget.amount == 0) 0.0 else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
            
            let summary: CategorySummary = {
                category = cat;
                spent = spent;
                budget = ?budget.amount;
                percentage = percentage;
            };
            result := Array.append([summary], result);
        };
        
        // Add categories without budgets
        for ((cat, spent) in categorySpending.entries()) {
            if (budgetMap.get(budgets, cat) == null) {
                let summary: CategorySummary = {
                    category = cat;
                    spent = spent;
                    budget = null;
                    percentage = 0.0;
                };
                result := Array.append([summary], result);
            };
        };
        
        result;
    };

    public query func getUserCategorySummary(
        userPrincipal : Principal,
        startDate: ?Time.Time,
        endDate: ?Time.Time
    ): async [CategorySummary] {
        if (not isAuthorized(userPrincipal)) throw Error.reject("Access Denied: Not authorized");
        
        let now = Time.now();
        let startTime = Option.get(startDate, now - 30 * 24 * 60 * 60 * 1_000_000_000); // Default 30 days
        let endTime = Option.get(endDate, now);
        
        var categorySpending = Map.HashMap<Category, Int>(0, Text.equal, Text.hash);
        
        // Get user's transactions and calculate spending by category
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return [];
        };
        
        for ((_, tx) in transactionMap.entries(userTxMap)) {
            if (tx.date >= startTime and tx.date <= endTime) {
                let currentSpent = Option.get(categorySpending.get(tx.category), 0);
                categorySpending.put(tx.category, currentSpent + tx.amount);
            };
        };
        
        var result: [CategorySummary] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            let spent = Option.get(categorySpending.get(cat), 0);
            let percentage = if (budget.amount == 0) 0.0 else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
            
            let summary: CategorySummary = {
                category = cat;
                spent = spent;
                budget = ?budget.amount;
                percentage = percentage;
            };
            result := Array.append([summary], result);
        };
        
        // Add categories without budgets
        for ((cat, spent) in categorySpending.entries()) {
            if (budgetMap.get(budgets, cat) == null) {
                let summary: CategorySummary = {
                    category = cat;
                    spent = spent;
                    budget = null;
                    percentage = 0.0;
                };
                result := Array.append([summary], result);
            };
        };
        
        result;
    };

    public query func getPaymentMethodSummary(
        startDate: ?Time.Time,
        endDate: ?Time.Time
    ): async [PaymentMethodSummary] {
        let now = Time.now();
        let startTime = Option.get(startDate, now - 30 * 24 * 60 * 60 * 1_000_000_000); // Default 30 days
        let endTime = Option.get(endDate, now);
        
        var methodSpending = Map.HashMap<PaymentMethod, Int>(0, Text.equal, Text.hash);
        var methodCount = Map.HashMap<PaymentMethod, Nat>(0, Text.equal, Text.hash);
        
        // Calculate spending by payment method
        for ((_, tx) in transactionMap.entries(transactions)) {
            if (tx.date >= startTime and tx.date <= endTime) {
                let currentSpent = Option.get(methodSpending.get(tx.paymentMethod), 0);
                methodSpending.put(tx.paymentMethod, currentSpent + tx.amount);
                
                let currentCount = Option.get(methodCount.get(tx.paymentMethod), 0);
                methodCount.put(tx.paymentMethod, currentCount + 1);
            };
        };
        
        var result: [PaymentMethodSummary] = [];
        for ((method, _) in budgetMap.entries(paymentMethods)) {
            let spent = Option.get(methodSpending.get(method), 0);
            let count = Option.get(methodCount.get(method), 0);
            
            let summary: PaymentMethodSummary = {
                method = method;
                spent = spent;
                count = count;
            };
            result := Array.append([summary], result);
        };
        
        result;
    };

    public query func getUserPaymentMethodSummary(
        userPrincipal : Principal,
        startDate: ?Time.Time,
        endDate: ?Time.Time
    ): async [PaymentMethodSummary] {
        if (not isAuthorized(userPrincipal)) throw Error.reject("Access Denied: Not authorized");
        
        let now = Time.now();
        let startTime = Option.get(startDate, now - 30 * 24 * 60 * 60 * 1_000_000_000); // Default 30 days
        let endTime = Option.get(endDate, now);
        
        var methodSpending = Map.HashMap<PaymentMethod, Int>(0, Text.equal, Text.hash);
        var methodCount = Map.HashMap<PaymentMethod, Nat>(0, Text.equal, Text.hash);
        
        // Get user's transactions and calculate spending by payment method
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return [];
        };
        
        for ((_, tx) in transactionMap.entries(userTxMap)) {
            if (tx.date >= startTime and tx.date <= endTime) {
                let currentSpent = Option.get(methodSpending.get(tx.paymentMethod), 0);
                methodSpending.put(tx.paymentMethod, currentSpent + tx.amount);
                
                let currentCount = Option.get(methodCount.get(tx.paymentMethod), 0);
                methodCount.put(tx.paymentMethod, currentCount + 1);
            };
        };
        
        var result: [PaymentMethodSummary] = [];
        for ((method, _) in budgetMap.entries(paymentMethods)) {
            let spent = Option.get(methodSpending.get(method), 0);
            let count = Option.get(methodCount.get(method), 0);
            
            let summary: PaymentMethodSummary = {
                method = method;
                spent = spent;
                count = count;
            };
            result := Array.append([summary], result);
        };
        
        result;
    };

    public query func getSpendingTrends(
        months: Nat,
        category: ?Category
    ): async [SpendingTrend] {
        let now = Time.now();
        let monthInNanos = 30 * 24 * 60 * 60 * 1_000_000_000;
        
        var result: [SpendingTrend] = [];
        var currentMonth = now;
        
        for (i in Iter.range(0, months - 1)) {
            let monthStart = currentMonth - monthInNanos;
            
            // Format period as YYYY-MM
            let timestamp = Int.abs(currentMonth) / 1_000_000_000; // Convert to seconds
            let date = {
                year = 1970 + Int.abs(timestamp) / (365 * 24 * 60 * 60);
                month = (Int.abs(timestamp) / (30 * 24 * 60 * 60)) % 12 + 1;
            };
            let period = Nat.toText(date.year) # "-" # 
                (if (date.month < 10) "0" # Nat.toText(date.month) else Nat.toText(date.month));
            
            var totalSpent: Int = 0;
            
            for ((_, tx) in transactionMap.entries(transactions)) {
                if (tx.date >= monthStart and tx.date < currentMonth) {
                    switch (category) {
                        case (?cat) {
                            if (tx.category == cat) {
                                totalSpent += tx.amount;
                            };
                        };
                        case null {
                            totalSpent += tx.amount;
                        };
                    };
                };
            };
            
            let trend: SpendingTrend = {
                period = period;
                spent = totalSpent;
            };
            
            result := Array.append([trend], result);
            currentMonth := monthStart;
        };
        
        result;
    };

    public query func getUserSpendingTrends(
        userPrincipal : Principal,
        months: Nat,
        category: ?Category
    ): async [SpendingTrend] {
        if (not isAuthorized(userPrincipal)) throw Error.reject("Access Denied: Not authorized");
        
        let now = Time.now();
        let monthInNanos = 30 * 24 * 60 * 60 * 1_000_000_000;
        
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return [];
        };
        
        var result: [SpendingTrend] = [];
        var currentMonth = now;
        
        for (i in Iter.range(0, months - 1)) {
            let monthStart = currentMonth - monthInNanos;
            
            // Format period as YYYY-MM
            let timestamp = Int.abs(currentMonth) / 1_000_000_000; // Convert to seconds
            let date = {
                year = 1970 + Int.abs(timestamp) / (365 * 24 * 60 * 60);
                month = (Int.abs(timestamp) / (30 * 24 * 60 * 60)) % 12 + 1;
            };
            let period = Nat.toText(date.year) # "-" # 
                (if (date.month < 10) "0" # Nat.toText(date.month) else Nat.toText(date.month));
            
            var totalSpent: Int = 0;
            
            for ((_, tx) in transactionMap.entries(userTxMap)) {
                if (tx.date >= monthStart and tx.date < currentMonth) {
                    switch (category) {
                        case (?cat) {
                            if (tx.category == cat) {
                                totalSpent += tx.amount;
                            };
                        };
                        case null {
                            totalSpent += tx.amount;
                        };
                    };
                };
            };
            
            let trend: SpendingTrend = {
                period = period;
                spent = totalSpent;
            };
            
            result := Array.append([trend], result);
            currentMonth := monthStart;
        };
        
        result;
    };


    // User-specific monthly summary - provides insights for transactions in the last month
    public query func getUserMonthlySummary(userPrincipal : Principal): async {
        periodStart: Time.Time;
        periodEnd: Time.Time;
        totalTransactions: Nat;
        totalExpenses: Int;
        totalIncome: Int;
        topCategories: [(Category, Int)]; // Category and amount spent
        topPaymentMethods: [(PaymentMethod, Int)]; // Payment method and amount
        budgetStatus: [(Category, Nat, Int, Float)]; // Category, budget, spent, percentage
    } {
        if (not isAuthorized(userPrincipal)) throw Error.reject("Access Denied: Not authorized");
        
        let now = Time.now();
        let monthStart = now - 30 * 24 * 60 * 60 * 1_000_000_000; // Last 30 days
        
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return {
                periodStart = monthStart;
                periodEnd = now;
                totalTransactions = 0;
                totalExpenses = 0;
                totalIncome = 0;
                topCategories = [];
                topPaymentMethods = [];
                budgetStatus = [];
            };
        };
        
        var txCount = 0;
        var expenses = 0;
        var income = 0;
        
        var categorySpending = Map.HashMap<Category, Int>(0, Text.equal, Text.hash);
        var paymentMethodSpending = Map.HashMap<PaymentMethod, Int>(0, Text.equal, Text.hash);
        
        // Process transactions
        for ((_, tx) in transactionMap.entries(userTxMap)) {
            if (tx.date >= monthStart) {
                txCount += 1;
                
                // Track income vs expenses
                if (tx.amount < 0) {
                    expenses += tx.amount;
                } else {
                    income += tx.amount;
                };
                
                // Track by category
                let currentCatSpent = Option.get(categorySpending.get(tx.category), 0);
                categorySpending.put(tx.category, currentCatSpent + tx.amount);
                
                // Track by payment method
                let currentMethodSpent = Option.get(paymentMethodSpending.get(tx.paymentMethod), 0);
                paymentMethodSpending.put(tx.paymentMethod, currentMethodSpent + tx.amount);
            };
        };
        
        // Convert to arrays and sort
        var catArray: [(Category, Int)] = [];
        for ((cat, amount) in categorySpending.entries()) {
            catArray := Array.append([(cat, amount)], catArray);
        };
        catArray := Array.sort<(Category, Int)>(
            catArray,
            func((_, a), (_, b)) {
                if (Int.abs(a) > Int.abs(b)) return #less 
                else if (Int.abs(a) < Int.abs(b)) return #greater 
                else return #equal;
            }
        );
        // Take top 5 categories
        let topCats = if (Array.size(catArray) > 5) Array.subArray(catArray, 0, 5) else catArray;
        
        var methodArray: [(PaymentMethod, Int)] = [];
        for ((method, amount) in paymentMethodSpending.entries()) {
            methodArray := Array.append([(method, amount)], methodArray);
        };
        // Sort payment methods by spending
        methodArray := Array.sort<(PaymentMethod, Int)>(
            methodArray,
            func((_, a), (_, b)) {
                if (Int.abs(a) > Int.abs(b)) return #less 
                else if (Int.abs(a) < Int.abs(b)) return #greater 
                else return #equal;
            }
        );
        // Take top 3 payment methods
        let topMethods = if (Array.size(methodArray) > 3) Array.subArray(methodArray, 0, 3) else methodArray;
        
        // Calculate budget status
        var budgetStatusArray: [(Category, Nat, Int, Float)] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            let spent = Option.get(categorySpending.get(cat), 0);
            let percentage = if (budget.amount == 0) 0.0 
                            else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
            
            budgetStatusArray := Array.append([(cat, budget.amount, spent, percentage)], budgetStatusArray);
        };
        // Sort by percentage
        budgetStatusArray := Array.sort<(Category, Nat, Int, Float)>(
            budgetStatusArray,
            func((_, _, _, a), (_, _, _, b)) {
                if (a > b) return #less else if (a < b) return #greater else return #equal;
            }
        );
        
        return {
            periodStart = monthStart;
            periodEnd = now;
            totalTransactions = txCount;
            totalExpenses = expenses;
            totalIncome = income;
            topCategories = topCats;
            topPaymentMethods = topMethods;
            budgetStatus = budgetStatusArray;
        };
    };

    // User-specific dashboard summary
    public query func getUserDashboardSummary(userPrincipal : Principal): async {
        totalTransactions: Nat;
        totalExpenses: Int;
        totalIncome: Int;
        categoriesCount: Nat;
        budgetStatus: [(Category, Float)]; // Category and percentage used
    } {
        if (not isAuthorized(userPrincipal)) throw Error.reject("Access Denied: Not authorized");
        
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return {
                totalTransactions = 0;
                totalExpenses = 0;
                totalIncome = 0;
                categoriesCount = 0;
                budgetStatus = [];
            };
        };
        
        var totalTxCount = 0;
        var expenses = 0;
        var income = 0;
        var userCategories = Map.HashMap<Category, Bool>(0, Text.equal, Text.hash);
        
        // Calculate totals and track used categories
        for ((_, tx) in transactionMap.entries(userTxMap)) {
            totalTxCount += 1;
            if (tx.amount < 0) {
                expenses += tx.amount;
            } else {
                income += tx.amount;
            };
            userCategories.put(tx.category, true);
        };
        
        // Calculate budget usage percentages for categories the user has used
        var categoryUsage: [(Category, Float)] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            if (userCategories.get(cat) != null) {
                var spent = 0;
                for ((_, tx) in transactionMap.entries(userTxMap)) {
                    if (tx.category == cat) {
                        spent += tx.amount;
                    };
                };
                
                let percentage = if (budget.amount == 0) 0.0 
                                else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
                
                categoryUsage := Array.append([(cat, percentage)], categoryUsage);
            };
        };
        
        // Sort by highest percentage first
        categoryUsage := Array.sort<(Category, Float)>(
            categoryUsage,
            func((_, a), (_, b)) {
                if (a > b) return #less else if (a < b) return #greater else return #equal;
            }
        );
        
        return {
            totalTransactions = totalTxCount;
            totalExpenses = expenses;
            totalIncome = income;
            categoriesCount = userCategories.size();
            budgetStatus = categoryUsage;
        };
    };

    // Dashboard Summary function
    public query func getDashboardSummary(): async {
        totalTransactions: Nat;
        totalExpenses: Int;
        totalIncome: Int;
        categoriesCount: Nat;
        budgetStatus: [(Category, Float)];
    } {
        var totalTxCount = 0;
        var expenses = 0;
        var income = 0;
        
        for ((_, tx) in transactionMap.entries(transactions)) {
            totalTxCount += 1;
            if (tx.amount < 0) {
                expenses += tx.amount;
            } else {
                income += tx.amount;
            };
        };
        
        var categoryUsage: [(Category, Float)] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            var spent = 0;
            for ((_, tx) in transactionMap.entries(transactions)) {
                if (tx.category == cat) {
                    spent += tx.amount;
                };
            };
            
            let percentage = if (budget.amount == 0) 0.0 
                            else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
            
            categoryUsage := Array.append([(cat, percentage)], categoryUsage);
        };
        
        categoryUsage := Array.sort<(Category, Float)>(
            categoryUsage,
            func((_, a), (_, b)) {
                if (a > b) return #less else if (a < b) return #greater else return #equal;
            }
        );
        
        return {
            totalTransactions = totalTxCount;
            totalExpenses = expenses;
            totalIncome = income;
            categoriesCount = budgetMap.size(categories);
            budgetStatus = categoryUsage;
        };
    };
    
    // Budget Alerts for users
    public shared query ({caller}) func getBudgetAlertsForUser(userPrincipal: Principal): async [(Category, Int, Nat, Float)] {
        if (not isAuthorized(caller)) throw Error.reject("Access Denied: Not authorized");
        
        let ?settings = usersMap.get(notificationSettings, userPrincipal) else {
            return [];
        };
        
        let threshold = settings.budgetWarningThreshold;
        let now = Time.now();
        let monthStart = now - 30 * 24 * 60 * 60 * 1_000_000_000; // Approximately 30 days
        
        var alerts: [(Category, Int, Nat, Float)] = []; // Category, spent, budget, percentage
        
        // Get user's transactions
        let ?userTxMap = userTransactionMap.get(userTransactions, userPrincipal) else {
            return [];
        };
        
        // Calculate current month's spending by category
        var categorySpending = Map.HashMap<Category, Int>(0, Text.equal, Text.hash);
        for ((_, tx) in transactionMap.entries(userTxMap)) {
            if (tx.date >= monthStart) {
                let currentSpent = Option.get(categorySpending.get(tx.category), 0);
                categorySpending.put(tx.category, currentSpent + tx.amount);
            };
        };
        
        // Check against budget thresholds
        for ((cat, budget) in budgetMap.entries(budgets)) {
            let spent = Option.get(categorySpending.get(cat), 0);
            let percentage = if (budget.amount == 0) 0.0 
                            else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
            
            // Only alert if over user's threshold
            if (percentage >= Float.fromInt(threshold)) {
                alerts := Array.append([(cat, spent, budget.amount, percentage)], alerts);
            };
        };
        
        // Sort by percentage (highest first)
        alerts := Array.sort<(Category, Int, Nat, Float)>(
            alerts,
            func((_, _, _, a), (_, _, _, b)) {
                if (a > b) return #less else if (a < b) return #greater else return #equal;
            }
        );
        
        alerts;
    };
}
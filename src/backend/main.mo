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
        username : Text;
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
        #shortUsername;
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
        username: Text;
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

    var nextTransactionId : TransactionId = 0;
    var adminPrincipalOpt : ?Principal = null;

    transient let usersMap = OrderedMap.Make<Principal>(Principal.compare);
    transient let transactionMap = OrderedMap.Make<TransactionId>(Nat.compare);
    transient let budgetMap = OrderedMap.Make<Category>(Text.compare);
    transient let inviteMap = OrderedMap.Make<InviteToken>(Text.compare);
    
    var users : OrderedMap.Map<Principal, User> = usersMap.empty<User>();
    var transactions : OrderedMap.Map<TransactionId, Transaction> = transactionMap.empty<Transaction>();
    var budgets : OrderedMap.Map<Category, Budget> = budgetMap.empty<Budget>();
    var invites : OrderedMap.Map<InviteToken, Invite> = inviteMap.empty<Invite>();
    var categories: OrderedMap.Map<Category, Time.Time> = budgetMap.empty<Time.Time>();
    var paymentMethods: OrderedMap.Map<PaymentMethod, Time.Time> = budgetMap.empty<Time.Time>();
    var userProfiles: OrderedMap.Map<Principal, UserProfile> = usersMap.empty<UserProfile>();
    var notificationSettings: OrderedMap.Map<Principal, NotificationSettings> = usersMap.empty<NotificationSettings>();
    
    // Authorization helpers
    func initializeAdmin(principal : Principal) {
        if (adminPrincipalOpt == null and usersMap.size(users) == 0) {
            let newUser : User = {
                principal = principal;
                username = "admin";
                role = #Admin;
                joinedAt = Time.now();
            };
            users := usersMap.put(users, principal, newUser);
            adminPrincipalOpt := ?principal;
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

    func canEditTransaction(caller: Principal, txId: TransactionId): Bool {
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
        // if (not isAuthorized(caller)) throw Error.reject("Access Denied: Not authorized");
        
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
        transactions := transactionMap.put(transactions, newId, newTransaction);
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
        if (not canEditTransaction(caller, id)) throw Error.reject("Access Denied: Cannot edit this transaction.");
        
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
        transactions := transactionMap.put(transactions, id, updatedTransaction);
        
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
        if (not canEditTransaction(caller, id)) throw Error.reject("Access Denied: Cannot delete this transaction.");
        
        let ?_tx = transactionMap.get(transactions, id) else return #invalidTxn;
        transactions := transactionMap.delete(transactions, id);
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
        result := Array.sort<User>(
            result,
            func(userA, userB) {
                Text.compare(userA.username, userB.username);
            },
        );
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

    public shared ({ caller }) func acceptInvite(token : InviteToken, username : Text) : async InvitationResponse {
        let now = Time.now();
        if (usersMap.get(users, caller) != null) return #alreadyRegistered;
        if (Text.size(username) < 3) return #shortUsername;
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
            username = username;
            role = #Editor;
            joinedAt = now;
        };
        users := usersMap.put(users, caller, newUser);
        
        let defaultProfile : UserProfile = {
            username = username;
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
        users := usersMap.delete(users, userPrincipal);
        
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

    public query({ caller }) func getUserProfile(): async ?UserProfile {
        usersMap.get(userProfiles, caller);
    };

    // Budget Notification Settings
    public shared({ caller }) func setNotificationSettings(settings: NotificationSettings): async UpdateProfileResponse {
        if (not isAuthorized(caller)) return #invalidUser;
        
        notificationSettings := usersMap.put(notificationSettings, caller, settings);
        #success;
    };

    public query({ caller }) func getNotificationSettings(): async ?NotificationSettings {
        usersMap.get(notificationSettings, caller);
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

    public query func getPaymentMethodSummary(
        startDate: ?Time.Time,
        endDate: ?Time.Time
    ): async [PaymentMethodSummary] {
        let now = Time.now();
        let startTime = Option.get(startDate, now - 30 * 24 * 60 * 60 * 1_000_000_000); // Default 30 days
        let endTime = Option.get(endDate, now);
        
        var methodSpending = Map.HashMap<PaymentMethod, (Int, Nat)>(0, Text.equal, Text.hash);
        
        for ((_, tx) in transactionMap.entries(transactions)) {
            if (tx.date >= startTime and tx.date <= endTime) {
                let (currentSpent, currentCount) = Option.get(methodSpending.get(tx.paymentMethod), (0, 0));
                methodSpending.put(tx.paymentMethod, (currentSpent + tx.amount, currentCount + 1));
            };
        };
        
        var result: [PaymentMethodSummary] = [];
        for ((method, (spent, count)) in methodSpending.entries()) {
            let summary: PaymentMethodSummary = {
                method = method;
                spent = spent;
                count = count;
            };
            result := Array.append([summary], result);
        };
        
        result;
    };
    
    // Additional analytics endpoint for dashboard
    public query func getDashboardSummary(): async {
        totalTransactions: Nat;
        totalExpenses: Int;
        totalIncome: Int;
        categoriesCount: Nat;
        budgetStatus: [(Category, Float)]; // Category and percentage used
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
        
        // Calculate budget usage percentages
        var categoryUsage: [(Category, Float)] = [];
        for ((cat, budget) in budgetMap.entries(budgets)) {
            var spent = 0;
            for ((_, tx) in transactionMap.entries(transactions)) {
                if (tx.category == cat and tx.amount < 0) {
                    spent += tx.amount;
                };
            };
            
            let percentage = if (budget.amount == 0) 0.0 
                            else Float.fromInt(Int.abs(spent)) / Float.fromInt(budget.amount) * 100.0;
            
            categoryUsage := Array.append([(cat, percentage)], categoryUsage);
        };
        
        // Sort by highest percentage first
        categoryUsage := Array.sort<(Category, Float)>(
            categoryUsage,
            func((_, a), (_, b)) {
                if (a > b) #less else if (a < b) #greater else #equal
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

    // Notification system to check budget thresholds
    public shared({ caller }) func getBudgetAlerts(): async [(Category, Int, Nat, Float)] {
        if (not isAuthorized(caller)) throw Error.reject("Access Denied: Not authorized");
        
        let ?settings = usersMap.get(notificationSettings, caller) else {
            return [];
        };
        
        let threshold = settings.budgetWarningThreshold;
        let now = Time.now();
        let monthStart = now - 30 * 24 * 60 * 60 * 1_000_000_000; // Approximately 30 days
        
        var alerts: [(Category, Int, Nat, Float)] = []; // Category, spent, budget, percentage
        
        // Calculate current month's spending by category
        var categorySpending = Map.HashMap<Category, Int>(0, Text.equal, Text.hash);
        for ((_, tx) in transactionMap.entries(transactions)) {
            if (tx.date >= monthStart and tx.amount < 0) {
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
        
        alerts;
    };

}
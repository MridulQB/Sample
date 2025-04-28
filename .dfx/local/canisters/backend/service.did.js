export const idlFactory = ({ IDL }) => {
  const InviteToken = IDL.Text;
  const InvitationResponse = IDL.Variant({
    'shortUsername' : IDL.Null,
    'alreadyUsedToken' : IDL.Null,
    'expiredToken' : IDL.Null,
    'success' : IDL.Null,
    'invalidToken' : IDL.Null,
    'alreadyRegistered' : IDL.Null,
  });
  const PaymentMethod = IDL.Text;
  const PaymentMethodResponse = IDL.Variant({
    'invalidMethod' : IDL.Null,
    'methodExists' : IDL.Null,
    'success' : IDL.Null,
  });
  const Time = IDL.Int;
  const Category = IDL.Text;
  const AddTransactionResponse = IDL.Variant({
    'paymentMethodEmpty' : IDL.Null,
    'success' : IDL.Null,
    'categoryEmpty' : IDL.Null,
  });
  const DeleteBudgetResponse = IDL.Variant({
    'success' : IDL.Null,
    'invalidCategory' : IDL.Null,
  });
  const TransactionId = IDL.Nat;
  const DeleteTransactionResponse = IDL.Variant({
    'invalidTxn' : IDL.Null,
    'success' : IDL.Null,
  });
  const GenerateInviteLinkResponse = IDL.Variant({
    'success' : IDL.Null,
    'failed' : IDL.Null,
  });
  const Transaction = IDL.Record({
    'id' : TransactionId,
    'paymentMethod' : PaymentMethod,
    'owner' : IDL.Principal,
    'date' : Time,
    'createdAt' : Time,
    'updatedAt' : Time,
    'notes' : IDL.Opt(IDL.Text),
    'category' : Category,
    'amount' : IDL.Nat,
  });
  const Budget = IDL.Record({
    'updatedAt' : Time,
    'category' : Category,
    'amount' : IDL.Nat,
  });
  const CategorySummary = IDL.Record({
    'spent' : IDL.Int,
    'category' : Category,
    'budget' : IDL.Opt(IDL.Nat),
    'percentage' : IDL.Float64,
  });
  const NotificationSettings = IDL.Record({
    'emailNotifications' : IDL.Bool,
    'browserNotifications' : IDL.Bool,
    'budgetWarningThreshold' : IDL.Nat,
  });
  const PaymentMethodSummary = IDL.Record({
    'method' : PaymentMethod,
    'count' : IDL.Nat,
    'spent' : IDL.Int,
  });
  const UserProfile = IDL.Record({
    'theme' : IDL.Text,
    'notificationsEnabled' : IDL.Bool,
    'username' : IDL.Text,
    'preferredCurrency' : IDL.Text,
  });
  const Role = IDL.Variant({ 'Editor' : IDL.Null, 'Admin' : IDL.Null });
  const User = IDL.Record({
    'principal' : IDL.Principal,
    'username' : IDL.Text,
    'joinedAt' : Time,
    'role' : Role,
  });
  const CategoryAction = IDL.Variant({ 'add' : IDL.Null, 'delete' : IDL.Null });
  const CategoryResponse = IDL.Variant({
    'categoryExists' : IDL.Null,
    'success' : IDL.Null,
    'invalidCategory' : IDL.Null,
  });
  const RevokeAccessResponse = IDL.Variant({
    'unauthorizedActivity' : IDL.Null,
    'invalidUser' : IDL.Null,
    'success' : IDL.Null,
  });
  const SetBudgetResponse = IDL.Variant({
    'success' : IDL.Null,
    'categoryEmpty' : IDL.Null,
  });
  const UpdateProfileResponse = IDL.Variant({
    'invalidUser' : IDL.Null,
    'success' : IDL.Null,
  });
  const UpdateTransactionResponse = IDL.Variant({
    'paymentMethodEmpty' : IDL.Null,
    'invalidTxn' : IDL.Null,
    'success' : IDL.Null,
    'categoryEmpty' : IDL.Null,
  });
  return IDL.Service({
    'acceptInvite' : IDL.Func(
        [InviteToken, IDL.Text],
        [InvitationResponse],
        [],
      ),
    'addPaymentMethod' : IDL.Func([PaymentMethod], [PaymentMethodResponse], []),
    'addTransaction' : IDL.Func(
        [Time, IDL.Nat, Category, PaymentMethod, IDL.Opt(IDL.Text)],
        [AddTransactionResponse],
        [],
      ),
    'assertAdmin' : IDL.Func([], [], []),
    'checkBudgetStatus' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Category, IDL.Nat, IDL.Int, IDL.Nat, IDL.Bool))],
        [],
      ),
    'deleteBudget' : IDL.Func([Category], [DeleteBudgetResponse], []),
    'deletePaymentMethod' : IDL.Func(
        [PaymentMethod],
        [PaymentMethodResponse],
        [],
      ),
    'deleteTransaction' : IDL.Func(
        [TransactionId],
        [DeleteTransactionResponse],
        [],
      ),
    'generateInviteLink' : IDL.Func([], [GenerateInviteLinkResponse], []),
    'getAllTransactions' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TransactionId, Transaction))],
        ['query'],
      ),
    'getBudgetAlerts' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Category, IDL.Int, IDL.Nat, IDL.Float64))],
        [],
      ),
    'getBudgetSummary' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Category, IDL.Nat, IDL.Int, IDL.Nat))],
        ['query'],
      ),
    'getBudgets' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Category, Budget))],
        ['query'],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getCategorySummary' : IDL.Func(
        [IDL.Opt(Time), IDL.Opt(Time)],
        [IDL.Vec(CategorySummary)],
        ['query'],
      ),
    'getDashboardSummary' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalIncome' : IDL.Int,
            'totalExpenses' : IDL.Int,
            'budgetStatus' : IDL.Vec(IDL.Tuple(Category, IDL.Float64)),
            'categoriesCount' : IDL.Nat,
            'totalTransactions' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getFilteredTransactions' : IDL.Func(
        [
          IDL.Opt(Time),
          IDL.Opt(Time),
          IDL.Opt(IDL.Int),
          IDL.Opt(IDL.Int),
          IDL.Opt(Category),
          IDL.Opt(PaymentMethod),
        ],
        [IDL.Vec(IDL.Tuple(TransactionId, Transaction))],
        ['query'],
      ),
    'getNotificationSettings' : IDL.Func(
        [],
        [IDL.Opt(NotificationSettings)],
        ['query'],
      ),
    'getPaymentMethodSummary' : IDL.Func(
        [IDL.Opt(Time), IDL.Opt(Time)],
        [IDL.Vec(PaymentMethodSummary)],
        ['query'],
      ),
    'getPaymentMethods' : IDL.Func([], [IDL.Vec(PaymentMethod)], ['query']),
    'getTransaction' : IDL.Func(
        [TransactionId],
        [IDL.Opt(Transaction)],
        ['query'],
      ),
    'getUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getUsers' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'manageCategory' : IDL.Func(
        [Category, CategoryAction],
        [CategoryResponse],
        [],
      ),
    'revokeAccess' : IDL.Func([IDL.Principal], [RevokeAccessResponse], []),
    'setBudget' : IDL.Func([Category, IDL.Nat], [SetBudgetResponse], []),
    'setNotificationSettings' : IDL.Func(
        [NotificationSettings],
        [UpdateProfileResponse],
        [],
      ),
    'setUserProfile' : IDL.Func([UserProfile], [UpdateProfileResponse], []),
    'updateTransaction' : IDL.Func(
        [
          TransactionId,
          Time,
          IDL.Nat,
          Category,
          PaymentMethod,
          IDL.Opt(IDL.Text),
        ],
        [UpdateTransactionResponse],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AddTransactionResponse = { 'paymentMethodEmpty' : null } |
  { 'success' : null } |
  { 'categoryEmpty' : null };
export interface Budget {
  'updatedAt' : Time,
  'category' : Category,
  'amount' : bigint,
}
export type Category = string;
export type CategoryAction = { 'add' : null } |
  { 'delete' : null };
export type CategoryResponse = { 'categoryExists' : null } |
  { 'success' : null } |
  { 'invalidCategory' : null };
export interface CategorySummary {
  'spent' : bigint,
  'category' : Category,
  'budget' : [] | [bigint],
  'percentage' : number,
}
export type DeleteBudgetResponse = { 'success' : null } |
  { 'invalidCategory' : null };
export type DeleteTransactionResponse = { 'invalidTxn' : null } |
  { 'success' : null };
export type GenerateInviteLinkResponse = { 'success' : null } |
  { 'failed' : null };
export type InvitationResponse = { 'alreadyUsedToken' : null } |
  { 'expiredToken' : null } |
  { 'success' : null } |
  { 'invalidToken' : null } |
  { 'alreadyRegistered' : null };
export type InviteToken = string;
export interface NotificationSettings {
  'emailNotifications' : boolean,
  'browserNotifications' : boolean,
  'budgetWarningThreshold' : bigint,
}
export type PaymentMethod = string;
export type PaymentMethodResponse = { 'invalidMethod' : null } |
  { 'methodExists' : null } |
  { 'success' : null };
export interface PaymentMethodSummary {
  'method' : PaymentMethod,
  'count' : bigint,
  'spent' : bigint,
}
export type RevokeAccessResponse = { 'unauthorizedActivity' : null } |
  { 'invalidUser' : null } |
  { 'success' : null };
export type Role = { 'Editor' : null } |
  { 'Admin' : null };
export type SetBudgetResponse = { 'success' : null } |
  { 'categoryEmpty' : null };
export interface SpendingTrend { 'period' : string, 'spent' : bigint }
export type Time = bigint;
export interface Transaction {
  'id' : TransactionId,
  'paymentMethod' : PaymentMethod,
  'owner' : Principal,
  'date' : Time,
  'createdAt' : Time,
  'updatedAt' : Time,
  'notes' : [] | [string],
  'category' : Category,
  'amount' : bigint,
}
export type TransactionId = bigint;
export type UpdateProfileResponse = { 'invalidUser' : null } |
  { 'success' : null };
export type UpdateTransactionResponse = { 'paymentMethodEmpty' : null } |
  { 'invalidTxn' : null } |
  { 'success' : null } |
  { 'categoryEmpty' : null };
export interface User {
  'principal' : Principal,
  'joinedAt' : Time,
  'role' : Role,
}
export interface UserProfile {
  'theme' : string,
  'notificationsEnabled' : boolean,
  'preferredCurrency' : string,
}
export interface _SERVICE {
  'acceptInvite' : ActorMethod<[InviteToken], InvitationResponse>,
  'addPaymentMethod' : ActorMethod<[PaymentMethod], PaymentMethodResponse>,
  'addTransaction' : ActorMethod<
    [Time, bigint, Category, PaymentMethod, [] | [string]],
    AddTransactionResponse
  >,
  'assertAdmin' : ActorMethod<[], undefined>,
  'checkBudgetStatus' : ActorMethod<
    [],
    Array<[Category, bigint, bigint, bigint, boolean]>
  >,
  'deleteBudget' : ActorMethod<[Category], DeleteBudgetResponse>,
  'deletePaymentMethod' : ActorMethod<[PaymentMethod], PaymentMethodResponse>,
  'deleteTransaction' : ActorMethod<[TransactionId], DeleteTransactionResponse>,
  'generateInviteLink' : ActorMethod<[], GenerateInviteLinkResponse>,
  'getAllTransactions' : ActorMethod<[], Array<[TransactionId, Transaction]>>,
  'getBudgetAlertsForUser' : ActorMethod<
    [Principal],
    Array<[Category, bigint, bigint, number]>
  >,
  'getBudgetSummary' : ActorMethod<
    [],
    Array<[Category, bigint, bigint, bigint]>
  >,
  'getBudgets' : ActorMethod<[], Array<[Category, Budget]>>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getCategorySummary' : ActorMethod<
    [[] | [Time], [] | [Time]],
    Array<CategorySummary>
  >,
  'getDashboardSummary' : ActorMethod<
    [],
    {
      'totalIncome' : bigint,
      'totalExpenses' : bigint,
      'budgetStatus' : Array<[Category, number]>,
      'categoriesCount' : bigint,
      'totalTransactions' : bigint,
    }
  >,
  'getFilteredTransactions' : ActorMethod<
    [
      [] | [Time],
      [] | [Time],
      [] | [bigint],
      [] | [bigint],
      [] | [Category],
      [] | [PaymentMethod],
    ],
    Array<[TransactionId, Transaction]>
  >,
  'getNotificationSettingsByPrincipal' : ActorMethod<
    [Principal],
    [] | [NotificationSettings]
  >,
  'getNotificationSettingsNyCaller' : ActorMethod<
    [],
    [] | [NotificationSettings]
  >,
  'getPaymentMethodSummary' : ActorMethod<
    [[] | [Time], [] | [Time]],
    Array<PaymentMethodSummary>
  >,
  'getPaymentMethods' : ActorMethod<[], Array<PaymentMethod>>,
  'getSpendingTrends' : ActorMethod<
    [bigint, [] | [Category]],
    Array<SpendingTrend>
  >,
  'getTransaction' : ActorMethod<[TransactionId], [] | [Transaction]>,
  'getTransactionsByUser' : ActorMethod<
    [Principal],
    Array<[TransactionId, Transaction]>
  >,
  'getUserCategorySummary' : ActorMethod<
    [Principal, [] | [Time], [] | [Time]],
    Array<CategorySummary>
  >,
  'getUserDashboardSummary' : ActorMethod<
    [Principal],
    {
      'totalIncome' : bigint,
      'totalExpenses' : bigint,
      'budgetStatus' : Array<[Category, number]>,
      'categoriesCount' : bigint,
      'totalTransactions' : bigint,
    }
  >,
  'getUserMonthlySummary' : ActorMethod<
    [Principal],
    {
      'totalIncome' : bigint,
      'topCategories' : Array<[Category, bigint]>,
      'topPaymentMethods' : Array<[PaymentMethod, bigint]>,
      'totalExpenses' : bigint,
      'periodEnd' : Time,
      'budgetStatus' : Array<[Category, bigint, bigint, number]>,
      'periodStart' : Time,
      'totalTransactions' : bigint,
    }
  >,
  'getUserPaymentMethodSummary' : ActorMethod<
    [Principal, [] | [Time], [] | [Time]],
    Array<PaymentMethodSummary>
  >,
  'getUserProfileByCaller' : ActorMethod<[], [] | [UserProfile]>,
  'getUserProfileByPrincipal' : ActorMethod<[Principal], [] | [UserProfile]>,
  'getUserSpendingTrends' : ActorMethod<
    [Principal, bigint, [] | [Category]],
    Array<SpendingTrend>
  >,
  'getUserTransactionsByCaller' : ActorMethod<
    [],
    Array<[TransactionId, Transaction]>
  >,
  'getUserTransactionsByPrincipal' : ActorMethod<
    [Principal],
    Array<[TransactionId, Transaction]>
  >,
  'getUsers' : ActorMethod<[], Array<User>>,
  'manageCategory' : ActorMethod<[Category, CategoryAction], CategoryResponse>,
  'revokeAccess' : ActorMethod<[Principal], RevokeAccessResponse>,
  'setBudget' : ActorMethod<[Category, bigint], SetBudgetResponse>,
  'setNotificationSettings' : ActorMethod<
    [NotificationSettings],
    UpdateProfileResponse
  >,
  'setUserProfile' : ActorMethod<[UserProfile], UpdateProfileResponse>,
  'updateTransaction' : ActorMethod<
    [TransactionId, Time, bigint, Category, PaymentMethod, [] | [string]],
    UpdateTransactionResponse
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

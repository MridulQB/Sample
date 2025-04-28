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
export type InvitationResponse = { 'shortUsername' : null } |
  { 'alreadyUsedToken' : null } |
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
  'username' : string,
  'joinedAt' : Time,
  'role' : Role,
}
export interface UserProfile {
  'theme' : string,
  'notificationsEnabled' : boolean,
  'username' : string,
  'preferredCurrency' : string,
}
export interface _SERVICE {
  'acceptInvite' : ActorMethod<[InviteToken, string], InvitationResponse>,
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
  'getBudgetAlerts' : ActorMethod<
    [],
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
  'getNotificationSettings' : ActorMethod<[], [] | [NotificationSettings]>,
  'getPaymentMethodSummary' : ActorMethod<
    [[] | [Time], [] | [Time]],
    Array<PaymentMethodSummary>
  >,
  'getPaymentMethods' : ActorMethod<[], Array<PaymentMethod>>,
  'getTransaction' : ActorMethod<[TransactionId], [] | [Transaction]>,
  'getUserProfile' : ActorMethod<[], [] | [UserProfile]>,
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

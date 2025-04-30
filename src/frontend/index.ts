import { AuthClient } from "@dfinity/auth-client";
import { backend as backendActor } from "../declarations/backend/index.js";
import { HttpAgent } from "@dfinity/agent";
import {
  createActor,
  idlFactory,
} from "../declarations/backend/index.js";
import { Null } from "@dfinity/candid/lib/cjs/idl.js";

// Use local Internet Identity for development, mainnet for production
const IDENTITY_PROVIDER = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

// const IDENTITY_PROVIDER =  "https://identity.ic0.app"

let authClient: AuthClient | null = null;
let backend = backendActor;
let currentUser: {
  principal: { toText: () => string };
  username: string;
  role: any;
} | null = null;

// Initialize authentication and backend interaction
async function init() {
  try {
    authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get("invite");
    if (inviteToken && !isAuthenticated) {
      showInviteModal(inviteToken);
    } else if (isAuthenticated) {
      await loadCurrentUser();
      showAuthenticatedUI();
    } else {
      showLoginButton();
    }
  } catch (error) {
    console.error("Failed to initialize AuthClient:", error);
    showToast("Initialization failed", "error");
  }
}

// Show login button and handle login action
function showLoginButton() {
  const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
  if (loginBtn) {
    loginBtn.style.display = "block";
    loginBtn.addEventListener("click", async () => {
      if (!authClient) {
        console.error("AuthClient is not initialized");
        showToast("Authentication error", "error");
        return;
      }
      try {
        await authClient.login({
          identityProvider: IDENTITY_PROVIDER,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
          onSuccess: () => {
            console.log("Login successful");
            loadCurrentUser().then(showAuthenticatedUI);
          },
          onError: (error) => {
            console.error("Login failed:", error);
            showToast("Login failed", "error");
          },
        });
      } catch (error) {
        console.error("Error during login:", error);
        showToast("Login error", "error");
      }
    });
  } else {
    console.error("Login button not found (#loginBtn)");
  }
}

// Load current user data
async function loadCurrentUser() {
  try {
    const users = await backendActor.getUsers();
    const principal = authClient?.getIdentity().getPrincipal().toText();
    currentUser =
      users.find((user: any) => user.principal.toText() === principal) || null;
    if (!currentUser) {
      console.warn("Current user not found");
      showToast("User not found", "error");
    }
  } catch (error) {
    console.error("Failed to load user:", error);
    showToast("Failed to load user", "error");
  }
}

// Show authenticated UI
function showAuthenticatedUI() {
  const loginBtn = document.getElementById("loginBtn");
  const userInfo = document.getElementById("userInfo");
  const username = document.getElementById("username");
  const userRole = document.getElementById("userRole");
  const userPrincipal = document.getElementById("userPrincipal");
  const logoutBtn = document.getElementById("logoutBtn");
  const app = document.getElementById("app");
  const adminPanel = document.getElementById("adminPanel");

  if (loginBtn) loginBtn.style.display = "none";
  if (userInfo) userInfo.style.display = "flex";
  if (username && currentUser) username.innerText = currentUser.username;
  if (userRole && currentUser) {
    userRole.innerText = "tag" in currentUser.role ? "Editor" : "Admin";
  }
  if (userPrincipal && currentUser)
    userPrincipal.innerText = currentUser.principal.toText();
  if (logoutBtn) logoutBtn.style.display = "inline-block";
  if (app) app.style.display = "block";
  if (adminPanel && currentUser && "tag" in currentUser.role === false) {
    adminPanel.style.display = "block";
  }

  handleLogout();
  setupThemeToggle();
  loadBudgetSummary();
  loadTransactions();
  loadBudgets();
  loadUsers();
  setupTransactionModal();
  setupBudgetForm();
  setupInviteUser();
  setupTransactionFilters();
}

// Handle logout
function handleLogout() {
  const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (authClient) {
        try {
          await authClient.logout();
          console.log("Logout successful");
          window.location.href = "/"; // Clear URL params
        } catch (error) {
          console.error("Error during logout:", error);
          showToast("Logout failed", "error");
        }
      }
    });
  }
}

// Load budget summary
async function loadBudgetSummary() {
  const summaryContent = document.getElementById("budgetSummaryContent");
  const loader = document.getElementById("budgetSummaryLoader");
  if (!summaryContent || !loader) return;

  try {
    loader.style.display = "block";
    const summaries = await backendActor.getBudgetSummary();
    summaryContent.innerHTML = "";
    summaries.forEach(
      ([category, budget, spent, remaining]: [
        string,
        bigint,
        bigint,
        bigint,
      ]) => {
        const item = document.createElement("div");
        item.innerText = `${category}: Budget $${Number(budget) / 100}, Spent $${Number(spent) / 100}, Remaining $${Number(remaining) / 100}`;
        summaryContent.appendChild(item);
      },
    );
  } catch (error) {
    console.error("Failed to load budget summary:", error);
    showToast("Failed to load summary", "error");
  } finally {
    loader.style.display = "none";
  }
}

async function loadTransactions(filters = {}) {
  const tbody = document.getElementById("transactionBody");
  const loader = document.getElementById("transactionListLoader");

  if (!tbody || !loader) return;

  tbody.innerHTML = "";
  loader.style.display = "block";

  try {
    const a = await backendActor.assertAdmin();
    const result = await backendActor.getUserTransactionsByCaller();
    console.log("result : ",result)
    const flat = result.flat();
    const paired = [];
    let htmlContent = '';

    for (let i = 0; i < flat.length; i += 2) {
      const id = flat[i] as bigint;
      const tx = flat[i + 1] as any;
      paired.push([id, tx]);
    }

    paired.sort((a, b) => {
      return Number(a[0]) - Number(b[0]);
    });

    for (const [id, tx] of paired) {
      htmlContent += `
        <tr>
          <td>${id.toString()}</td>
          <td>${new Date(Number(tx.date) / 1_000_000).toLocaleDateString()}</td>
          <td>${(Number(tx.amount) / 100).toFixed(2)}</td>
          <td>${tx.category}</td>
          <td>${tx.paymentMethod}</td>
          <td>${tx.notes?.join(", ") || "-"}</td>
          <td>
            <button onclick="handleDelete(${id})">Delete</button>
            <button onclick="openTransactionModal(${tx.id}, '${tx.paymentMethod}', ${tx.amount}, '${tx.category}', ${tx.date}, '${Array.isArray(tx.notes) ? tx.notes.join(", ") : tx.notes}')">Edit</button>
          </td>
        </tr>
      `;
    }

    tbody.innerHTML = htmlContent;

  } catch (err) {
    console.error("Failed to load transactions:", err);
    showToast("Failed to load transactions", "error");
  } finally {
    loader.style.display = "none";
  }
}


(window as any).handleDelete = async function handleDelete(id: bigint) {
  try {
    const result: any = await backendActor.deleteTransaction(id);
    if (result.success == null) {
      showToast("Transaction deleted successfully!", "success");
      await loadTransactions();
    } else {
      showToast("Error while deleting Transaction!", "error");
      await loadTransactions();
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    alert("Something went wrong while deleting.");
  }
}

// Load budgets
async function loadBudgets() {
  const budgetList = document.getElementById("budgetList");
  const loader = document.getElementById("budgetListLoader");
  if (!budgetList || !loader) return;

  try {
    loader.style.display = "block";
    const budgets = await backendActor.getBudgets();
    budgetList.innerHTML = "";
    budgets.forEach(([category, budget]: [string, any]) => {
      const item = document.createElement("div");
      item.innerText = `${category}: $${Number(budget.amount) / 100}`;
      if (currentUser && "tag" in currentUser.role === false) {
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "button danger small";
        deleteBtn.onclick = () => confirmDeleteBudget(category);
        item.appendChild(deleteBtn);
      }
      budgetList.appendChild(item);
    });
    updateCategorySuggestions(budgets.map(([cat]: [string, any]) => cat));
  } catch (error) {
    console.error("Failed to load budgets:", error);
    showToast("Failed to load budgets", "error");
  } finally {
    loader.style.display = "none";
  }
}

// Load users (admin only)
async function loadUsers() {
  const userList = document.getElementById("userList");
  const loader = document.getElementById("userListLoader");
  if (!userList || !loader) return;

  try {
    loader.style.display = "block";
    const users = await backendActor.getUsers();
    userList.innerHTML = "";
    users.forEach((user: any) => {
      const li = document.createElement("li");
      li.innerText = `${user.username} (${"tag" in user.role ? "Editor" : "Admin"})`;
      if (
        currentUser &&
        "tag" in currentUser.role === false &&
        user.principal.toText() !== currentUser.principal.toText()
      ) {
        const revokeBtn = document.createElement("button");
        revokeBtn.innerText = "Revoke Access";
        revokeBtn.className = "button danger small";
        revokeBtn.onclick = () => confirmRevokeAccess(user.principal);
        li.appendChild(revokeBtn);
      }
      userList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load users:", error);
    showToast("Failed to load users", "error");
  } finally {
    loader.style.display = "none";
  }
}

// Setup transaction modal
function setupTransactionModal() {
  const modal = document.getElementById("transactionModal") as HTMLDivElement;
  const form = document.getElementById("transactionForm") as HTMLFormElement;
  const closeBtn = document.getElementById(
    "closeTransactionModalBtn",
  ) as HTMLButtonElement;
  const addBtn = document.getElementById(
    "addTransactionBtn",
  ) as HTMLButtonElement;

  if (addBtn) {
    addBtn.onclick = () => openTransactionModal();
  }

  if (closeBtn) {
    closeBtn.onclick = () => closeModal(modal);
  }

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const idInput = document.getElementById(
        "transactionId",
      ) as HTMLInputElement;
      const dateInput = document.getElementById(
        "transactionDate",
      ) as HTMLInputElement;
      const amountInput = document.getElementById(
        "transactionAmount",
      ) as HTMLInputElement;
      const categoryInput = document.getElementById(
        "transactionCategory",
      ) as HTMLInputElement;
      const paymentMethodInput = document.getElementById(
        "transactionPaymentMethod",
      ) as HTMLInputElement;
      const notesInput = document.getElementById(
        "transactionNotes",
      ) as HTMLTextAreaElement;

      const date = BigInt(new Date(dateInput.value).getTime() * 1000000);
      const amount = BigInt(Math.round(Number(amountInput.value) * 100));
      const category = categoryInput.value;
      const id = idInput.value ? BigInt(idInput.value) : null;
      const paymentMethod = paymentMethodInput.value;
      const notes: any = notesInput.value.trim() ? [notesInput.value] : null;

      try {
        if (id !== null || id !== undefined) {
          const adminResult = await backendActor.assertAdmin();
          const result: any = await backendActor.updateTransaction(
            id,
            date,
            amount,
            category,
            paymentMethod,
            notes,
          );
          if (result?.success == null) {
            showToast("Transaction updated", "success");
            loadTransactions();
          } else {
            showToast("Failed to update transaction", "error");
          }
        } else {
          const adminResult = await backendActor.assertAdmin();
          const result: any = await backendActor.addTransaction(
            date,
            amount,
            category,
            paymentMethod,
            notes,
          );
          if (result?.success == null) {
            showToast("Transaction added", "success");
            loadTransactions();
          } else {
            showToast("Failed to add transaction", "error");
          }
        }

        closeModal(modal);
      } catch (error) {
        console.error("Error saving transaction:", error);
        showToast("Error saving transaction", "error");
      }
    };
  }
}

// Open transaction modal
(window as any).openTransactionModal = function openTransactionModal(id : any,paymentMethod : any, amount : any, category: any,  date : any , notes: any  ) {
  try {
    const modal = document.getElementById("transactionModal") as HTMLDivElement;
    const overlay = document.getElementById("modalOverlay") as HTMLDivElement;
    const form = document.getElementById("transactionForm") as HTMLFormElement;
  
    // Get input fields
    const idInput = document.getElementById("transactionId") as HTMLInputElement;
    const dateInput = document.getElementById("transactionDate") as HTMLInputElement;
    const amountInput = document.getElementById("transactionAmount") as HTMLInputElement;
    const categoryInput = document.getElementById("transactionCategory") as HTMLInputElement;
    const paymentMethodInput = document.getElementById("transactionPaymentMethod") as HTMLInputElement;
    const notesInput = document.getElementById("transactionNotes") as HTMLTextAreaElement;
  
    // Reset the form to clear previous inputs
    form.reset();
  
    // Check if modal and overlay exist
    if (modal && overlay) {
      // Add 'visible' class to show modal and overlay
      overlay.style.display = 'block';
      modal.style.display = 'block';
      setTimeout(() => {
        overlay.classList.add("visible");
        modal.classList.add("visible");
      }, 10);
      // If editing an existing transaction, populate the form with existing data
      if (id !== null || id !== undefined) {
        idInput.value = id.toString();
        dateInput.value = new Date(Number(date) / 1000000).toISOString().split("T")[0];
        amountInput.value = (Number(amount) / 100).toString();
        categoryInput.value = category;
        paymentMethodInput.value = paymentMethod;
        notesInput.value = notes || "";
      } else {
        // If no transaction data (new transaction), set current date
        dateInput.value = new Date().toISOString().split("T")[0];
      }
    } else {
      console.error("Modal or overlay not found");
    }
  } catch (error) {
    console.log("error : ",error)
  }

}

// Close transaction modal
function closeTransactionModal() {

  // Get modal elements
  const modal = document.getElementById("transactionModal") as HTMLDivElement;
  const overlay = document.getElementById("modalOverlay") as HTMLDivElement;

  // Remove 'visible' class to hide modal and overlay
  overlay.classList.remove("visible");
  modal.classList.remove("visible");

  // Reset the display after animation
  setTimeout(() => {
    overlay.style.display = 'none';
    modal.style.display = 'none';
  }, 300);
}

// Event listener for 'Add New Transaction' button
document.getElementById("addTransactionBtn")?.addEventListener("click", () => {
  openTransactionModal();
});

// Event listener for 'Cancel' button inside the modal
document.getElementById("closeTransactionModalBtn")?.addEventListener("click", closeTransactionModal);

// Setup budget form
function setupBudgetForm() {
  const form = document.getElementById("budgetForm") as HTMLFormElement;
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const categoryInput = document.getElementById(
        "budgetCategory",
      ) as HTMLInputElement;
      const amountInput = document.getElementById(
        "budgetAmount",
      ) as HTMLInputElement;

      const category = categoryInput.value;
      const amount = BigInt(Math.round(Number(amountInput.value) * 100));

      try {
        const result = await backendActor.setBudget(category, amount);
        if ("success" in result) {
          showToast("Budget set", "success");
          loadBudgets();
          form.reset();
        } else {
          showToast("Failed to set budget", "error");
        }
      } catch (error) {
        console.error("Error setting budget:", error);
        showToast("Error setting budget", "error");
      }
    };
  }
}

// Setup invite user
function setupInviteUser() {
  const inviteBtn = document.getElementById(
    "inviteUserBtn",
  ) as HTMLButtonElement;
  const linkDisplay = document.getElementById(
    "inviteLinkDisplay",
  ) as HTMLDivElement;
  const linkElement = document.getElementById("inviteLink") as HTMLElement;
  const copyBtn = document.getElementById(
    "copyInviteLinkBtn",
  ) as HTMLButtonElement;

  if (inviteBtn) {
    inviteBtn.onclick = async () => {
      try {
        const result = await backendActor.generateInviteLink();
        if ("success" in result) {
          const inviteLink = `${window.location.origin}?invite=${result.success}`;
          linkElement.innerText = inviteLink;
          linkDisplay.style.display = "block";
          showToast("Invite link generated", "success");
        } else {
          showToast("Failed to generate invite", "error");
        }
      } catch (error) {
        console.error("Error generating invite:", error);
        showToast("Error generating invite", "error");
      }
    };
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(linkElement.innerText);
      showToast("Link copied", "success");
    };
  }
}

// Show invite modal
function showInviteModal(token: string) {
  const modal = document.getElementById("acceptInviteModal") as HTMLDivElement;
  const overlay = document.getElementById("modalOverlay") as HTMLDivElement;
  const form = document.getElementById("acceptInviteForm") as HTMLFormElement;
  const tokenInput = document.getElementById("inviteToken") as HTMLInputElement;
  const errorElement = document.getElementById(
    "inviteError",
  ) as HTMLParagraphElement;
  const closeBtn = document.getElementById(
    "closeInviteModalBtn",
  ) as HTMLButtonElement;

  tokenInput.value = token;
  errorElement.style.display = "none";
  modal.style.display = "block";
  overlay.style.display = "block";

  if (closeBtn) {
    closeBtn.onclick = () => closeModal(modal);
  }

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById(
        "inviteUsername",
      ) as HTMLInputElement;
      const username = usernameInput.value;

      try {
        const result = await backendActor.acceptInvite(token, username);
        if ("success" in result) {
          showToast("Registration successful", "success");
          closeModal(modal);
          if (authClient) {
            await authClient.login({
              identityProvider: IDENTITY_PROVIDER,
              onSuccess: () => loadCurrentUser().then(showAuthenticatedUI),
            });
          }
        } else {
          errorElement.innerText = getInviteErrorMessage(result);
          errorElement.style.display = "block";
        }
      } catch (error) {
        console.error("Error accepting invite:", error);
        showToast("Error accepting invite", "error");
      }
    };
  }
}

// Get invite error message
function getInviteErrorMessage(result: any): string {
  if ("shortUsername" in result) return "Username too short";
  if ("alreadyUsedToken" in result) return "Invite already used";
  if ("expiredToken" in result) return "Invite expired";
  if ("invalidToken" in result) return "Invalid invite";
  if ("alreadyRegistered" in result) return "Already registered";
  return "Unknown error";
}


async function getFilterTransactions(filters: {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  paymentMethod?: string;
} = {}) {
  const tbody = document.getElementById("FitertransactionBody")
  const toNullable = <T>(val?: T): [T] | [] => (val !== undefined ? [val] : []);

  const startDate = toNullable(filters.startDate ? BigInt(new Date(filters.startDate).getTime() * 1_000_000) : undefined);
  const endDate = toNullable(filters.endDate ? BigInt(new Date(filters.endDate).getTime() * 1_000_000) : undefined);
  const minAmount = toNullable(filters.minAmount !== undefined ? BigInt(filters.minAmount) : undefined);
  const maxAmount = toNullable(filters.maxAmount !== undefined ? BigInt(filters.maxAmount) : undefined);
  const category = filters.category ? [filters.category.trim()] : [];
  const paymentMethodOpt = filters.paymentMethod ? [filters.paymentMethod.trim()] : [];
  tbody.innerHTML = ""

  try {
    const result = await backendActor.getFilteredTransactions(
      startDate,
      endDate,
      minAmount,
      maxAmount,
      category,
      paymentMethodOpt
    );

    console.log("result : ", result);

    const flat = result.flat();

    const paired = [];
    for (let i = 0; i < flat.length; i += 2) {
      const id = flat[i] as bigint;
      const tx = flat[i + 1] as any;
      paired.push([id, tx]);
    }

    paired.sort((a, b) => {
      return Number(a[0]) - Number(b[0]);
    });

    for (const [id, tx] of paired) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${id.toString()}</td>
        <td>${new Date(Number(tx.date) / 1_000_000).toLocaleDateString()}</td>
        <td>${(Number(tx.amount) / 100).toFixed(2)}</td>
        <td>${tx.category}</td>
        <td>${tx.paymentMethod}</td>
        <td>${tx.notes?.join(", ") || "-"}</td>
        <td>
          <button onclick="handleDelete(${id})">Delete</button>
          <button onclick="openTransactionModal(${id},${tx})"
          data-id="${id}">Edit</button>
        </td>
      `;

      tbody.appendChild(row)
    }

  } catch (error) {
    console.log("error", error)
  }
}

// Setup transaction filters
function setupTransactionFilters() {
  const applyBtn = document.getElementById(
    "applyFiltersBtn",
  ) as HTMLButtonElement;
  const clearBtn = document.getElementById(
    "clearFiltersBtn",
  ) as HTMLButtonElement;
  const startDateInput = document.getElementById(
    "filterStartDate",
  ) as HTMLInputElement;
  const endDateInput = document.getElementById(
    "filterEndDate",
  ) as HTMLInputElement;
  const minAmountInput = document.getElementById(
    "filterMinAmount",
  ) as HTMLInputElement;
  const maxAmountInput = document.getElementById(
    "filterMaxAmount",
  ) as HTMLInputElement;
  const categoryInput = document.getElementById(
    "filterCategory",
  ) as HTMLInputElement;
  const paymentMethodInput = document.getElementById(
    "filterPaymentMethod",
  ) as HTMLInputElement;

  if (applyBtn) {
    applyBtn.onclick = () => {
      getFilterTransactions({
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        minAmount: minAmountInput.value
          ? Number(minAmountInput.value)
          : undefined,
        maxAmount: maxAmountInput.value
          ? Number(maxAmountInput.value)
          : undefined,
        category: categoryInput.value,
        paymentMethod: paymentMethodInput.value,
      });
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      startDateInput.value = "";
      endDateInput.value = "";
      minAmountInput.value = "";
      maxAmountInput.value = "";
      categoryInput.value = "";
      paymentMethodInput.value = "";
      loadTransactions();
    };
  }
}

// Update category suggestions
function updateCategorySuggestions(categories: string[]) {
  const datalist = document.getElementById(
    "categorySuggestions",
  ) as HTMLDataListElement;
  const paymentDatalist = document.getElementById(
    "paymentMethodSuggestions",
  ) as HTMLDataListElement;
  datalist.innerHTML = categories
    .map((cat) => `<option value="${cat}">`)
    .join("");
  paymentDatalist.innerHTML = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
  ]
    .map((method) => `<option value="${method}">`)
    .join("");
}

// Confirm delete budget
function confirmDeleteBudget(category: string) {
  showConfirmationModal(`Delete budget for ${category}?`, async () => {
    try {
      const result = await backendActor.deleteBudget(category);
      if ("success" in result) {
        showToast("Budget deleted", "success");
        loadBudgets();
      } else {
        showToast("Failed to delete budget", "error");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      showToast("Error deleting budget", "error");
    }
  });
}

// Confirm revoke access
function confirmRevokeAccess(principal: any) {
  showConfirmationModal(`Revoke access for this user?`, async () => {
    try {
      const result = await backendActor.revokeAccess(principal);
      if ("success" in result) {
        showToast("Access revoked", "success");
        loadUsers();
      } else {
        showToast("Failed to revoke access", "error");
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      showToast("Error revoking access", "error");
    }
  });
}

// Show confirmation modal
function showConfirmationModal(message: string, onConfirm: () => void) {
  const modal = document.getElementById("confirmationModal") as HTMLDivElement;
  const overlay = document.getElementById("modalOverlay") as HTMLDivElement;
  const messageElement = document.getElementById(
    "confirmationMessage",
  ) as HTMLParagraphElement;
  const yesBtn = document.getElementById("confirmYesBtn") as HTMLButtonElement;
  const noBtn = document.getElementById("confirmNoBtn") as HTMLButtonElement;

  messageElement.innerText = message;
  modal.style.display = "block";
  overlay.style.display = "block";

  yesBtn.onclick = () => {
    onConfirm();
    closeModal(modal);
  };
  noBtn.onclick = () => closeModal(modal);
}

// Close modal
function closeModal(modal: HTMLElement) {
  const overlay = document.getElementById("modalOverlay") as HTMLDivElement;
  modal.style.display = "none";
  overlay.style.display = "none";
}

// Toast function
function showToast(message: string, type: "success" | "error") {
  const container = document.getElementById("toastContainer") as HTMLDivElement;
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerText = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


// Setup theme toggle
function setupThemeToggle() {
  const toggleBtn = document.getElementById(
    "themeToggleBtn",
  ) as HTMLButtonElement;
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      document.body.classList.toggle("light-theme");
      document.body.classList.toggle("dark-theme");
    };
  }
}

// Entry point
init().catch((error) => {
  console.error("Initialization failed:", error);
  showToast("App failed to start", "error");
});

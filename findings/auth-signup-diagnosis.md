# Auth & Signup Process Diagnosis

## Summary
The signup process is currently broken due to a non-atomic creation flow and a silent "self-healing" mechanism that overwrites user data with defaults. Furthermore, type mismatches between the frontend and the database schema cause profile creation to fail, while the redirection logic incorrectly attempts to read profile data from the authentication account object rather than the database profile.

## Root Cause Chain
1. **Type Mismatch & Validation Failure**: `AuthPage.jsx` passes `studentId` and `phoneNumber` as strings to `AuthService.signUp`. Appwrite expects integers, causing `databases.createDocument` to fail.
2. **Non-Atomic Signup**: `AuthService.signUp` creates the authentication account before the database profile. When the profile creation fails (due to the type mismatch above), the account remains orphaned without a profile.
3. **Silent Default Fallback**: Upon login or session check, `AuthService.ensureUserProfile` detects the missing profile (404) and "self-heals" by calling `createUserProfileFromAccount`. This function creates a new profile document with hardcoded defaults: `level: '100'`, `studentId: 0`, and `phoneNumber: 0`.
4. **Incorrect Redirection Logic**: `AuthPage.jsx` and `AuthContext.tsx` attempt to read the `level` property from the Appwrite Account object (`user`) rather than the database profile (`userProfile`). Since the Account object lacks a `level` field, it defaults to `100` during redirection, regardless of the user's actual level.

## Findings & References

### 1. Non-Atomic Signup Flow
- **File**: `src/lib/appwrite.ts`
- **Lines**: 95-120
- **Finding**: `account.create()` is called at line 95. If the subsequent `databases.createDocument()` at line 102 fails, the account is already created, leading to an orphaned state.

### 2. Type Mismatch (String vs. Integer)
- **File**: `src/pages/AuthPage.jsx` (Lines 24, 28, 52)
- **File**: `src/lib/appwrite.ts` (Line 102)
- **Finding**: `AuthPage.jsx` collects `studentId` and `phoneNumber` as strings. They are passed through the context to `AuthService.signUp` and used directly in `createDocument` without being parsed into numbers. The Appwrite schema (`appwrite.config.json`) defines these as `integer`.

### 3. Silent Profile Fallback (Self-Heal)
- **File**: `src/lib/appwrite.ts`
- **Lines**: 197-214 (Creation), 217-234 (Trigger)
- **Finding**: `ensureUserProfile` silently creates a default profile if one is missing. The defaults used in `createUserProfileFromAccount` (Line 204-206) explain why users see Level 100 and zeroed-out IDs.

### 4. Incorrect Level Source for Routing
- **File**: `src/pages/AuthPage.jsx`
- **Lines**: 43, 116
- **Finding**: Redirection logic uses `user.level`. The `user` object in this context is the Appwrite Account object (from `useAuth`), which does not contain the `level` attribute. The `level` attribute only exists on the `userProfile` object.

### 5. Data Dropping in Self-Heal
- **File**: `src/lib/appwrite.ts`
- **Lines**: 197-214
- **Finding**: `createUserProfileFromAccount` only receives the `user` (Account) object. It has no access to the original signup `formData`, so it is forced to use placeholders for all academic fields.

## Hypothesis Verification
- **Atomic Calls**: **CORRECT**. The process is non-atomic.
- **Type Mismatch**: **CORRECT**. Strings are passed where integers are expected.
- **Silent Fallback**: **CORRECT**. `ensureUserProfile` creates a default profile on 404.
- **Routing Source**: **CORRECT**. Routing reads from the Account object instead of the Profile document.

## Open Questions / Confirmations
- **Appwrite Console Schema**: Confirmed via `appwrite.config.json`. `studentId` and `phoneNumber` are indeed integers.
- **AuthForm.tsx vs AuthPage.jsx**: Both files exist and seem to have slightly different implementations. `AuthPage.jsx` is currently being used for the main signup flow (based on the multi-phase description), while `AuthForm.tsx` appears to be a newer or alternative component that *does* include some `parseInt` logic (Line 44), but it is not the primary driver of the observed bug if the user is interacting with the multi-phase `AuthPage.jsx`.

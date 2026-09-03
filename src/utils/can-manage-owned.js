
/**
 * Shared ownership check: returns `true` if the current user is either
 * the owner of the resource or an admin. Used for delete permissions on
 * reports, submissions, and similar owned entities.
 * 
 * @param {string} ownerId - The ID of the resource owner.
 * @param {Object} auth - The current authentication context.
 * @param {string} auth.role - The current user's role ('admin' | 'student').
 * @param {string} auth.userId - The current user's ID.
 * @returns {boolean} `true` if the user can manage the resource.
 */
export function canManageOwned(ownerId, { role, userId }) {
    return role === "admin" || ownerId === userId;
}
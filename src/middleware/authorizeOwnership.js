// Ownership checks are handled inline in the service layer for this project.
// This file is kept to avoid broken imports during transition.
export async function authorizeOwnership(req, res, next) {
  next();
}

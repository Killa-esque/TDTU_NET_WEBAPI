const userHasPermission = (path: string, user: any) => {
  if (path.startsWith("/admin") && !user.isAdmin) return false;
  if (path.startsWith("/host") && !user.isHost) return false;
  return true;
};


export { userHasPermission };

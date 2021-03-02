export const textualRepresentationOfRole = (role) => {
   switch (role) {
      case 0:
         return "user";
      case 1:
         return "admin";
      case 2:
         return "superadmin";
   }
};

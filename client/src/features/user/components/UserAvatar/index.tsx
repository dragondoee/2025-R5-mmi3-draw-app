export type UserAvatarProps = {
  username: string;
  avatar: string;
}

// Composant pour afficher l'avatar d'un utilisateur
export const UserAvatar = (user: UserAvatarProps) => {
  const firstLetterUsername = user.username[0].toUpperCase();
  return (
    <div className="relative">
      <img className="size-8 rounded-box" src={user.avatar} alt={"photo de profil de "+user.username} />
      <p className="font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{firstLetterUsername}</p>
    </div>
  );
}
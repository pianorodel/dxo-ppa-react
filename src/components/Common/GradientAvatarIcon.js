export const GradientAvatarIcon = ({ name = "?", size = 64, avatarImg }) => {

  const computedInitials = (() => {
    const words = name?.trim().split(/\s+/) || [];
    if (words.length === 0) return '';
    if (words.length === 1) {
      const firstWord = words[0];
      return firstWord.length >= 2
        ? firstWord.slice(0, 2).toUpperCase()
        : firstWord.slice(0, 1).toUpperCase();
    }
    return `${words[0][0]?.toUpperCase() || ''}${words.at(-1)?.[0]?.toUpperCase() || ''}`;
  })();

  const ringStyle = {
    width: size, height: size, borderRadius: "50%",
    boxShadow: "0 4px 16px rgba(64,81,137,0.3)",
    border: "3px solid rgba(255,255,255,0.85)",
    flexShrink: 0,
  };

  if (avatarImg) {
    const avatarImage = process.env.REACT_APP_S3 + avatarImg;

    return (
      <img
        src={avatarImage}
        alt={name}
        style={{
          ...ringStyle,
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <div style={{
      ...ringStyle,
      background: "linear-gradient(135deg, #405189 0%, #0ab39c 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: size * 0.3,
    }}>{computedInitials}</div>
  );
}
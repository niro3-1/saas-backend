// Updated JWT payload to include tier information
func generateToken(user User) (string, error) {
	claims := &Claims{
		UserID: user.ID,
		Tier:   user.Tier, // New field
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("secret-key"))
}
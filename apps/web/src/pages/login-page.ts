export const renderLoginPage = (): string => {
  return [
    '<main>',
    '<h1>Sign in</h1>',
    '<form method="post" action="/auth/login">',
    '<label>Email <input type="email" name="email" required /></label>',
    '<label>Password <input type="password" name="password" required /></label>',
    '<button type="submit">Log in</button>',
    '</form>',
    '</main>',
  ].join('')
}

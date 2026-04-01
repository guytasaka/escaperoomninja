export const renderRegisterPage = (): string => {
  return [
    '<main>',
    '<h1>Create account</h1>',
    '<form method="post" action="/auth/register">',
    '<label>Email <input type="email" name="email" required /></label>',
    '<label>Password <input type="password" name="password" required /></label>',
    '<button type="submit">Create account</button>',
    '</form>',
    '</main>',
  ].join('')
}

import type { AudienceProfileCard } from '../types'

export const renderAudiencePage = (profile: AudienceProfileCard | null): string => {
  const profileSection = profile
    ? [
        '<section>',
        '<h2>Audience Profile</h2>',
        `<p>Difficulty: ${profile.difficulty}</p>`,
        `<p>Audience: ${profile.audienceType}</p>`,
        `<p>Group Size: ${profile.groupSize}</p>`,
        `<p>${profile.psychologyProfile}</p>`,
        '<ul>',
        ...profile.recommendations.map((item) => `<li>${item}</li>`),
        '</ul>',
        '</section>',
      ].join('')
    : '<section><h2>Audience Profile</h2><p>No profile generated yet.</p></section>'

  return [
    '<main>',
    '<h1>Audience Planning</h1>',
    '<form method="post" action="/audience/recommendations">',
    '<label>Group Size <input type="number" name="groupSize" min="2" max="12" required /></label>',
    '<label>Difficulty <input name="difficulty" value="medium" required /></label>',
    '<label>Audience Type <input name="audienceType" value="friends" required /></label>',
    '<button type="submit">Generate Audience Recommendations</button>',
    '</form>',
    profileSection,
    '</main>',
  ].join('')
}

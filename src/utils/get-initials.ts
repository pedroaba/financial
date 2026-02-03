/**
 * Get the initial of a username
 * @param name - The username to get the initial of
 * @returns The initial of the username
 *
 * @example
 * getUsernameInitial('John Doe') // 'JD'
 * getUsernameInitial('John Doe Smith') // 'JS'
 * getUsernameInitial('John') // 'JO'
 * getUsernameInitial('') // '?'
 * getUsernameInitial(undefined) // '?'
 * getUsernameInitial(null) // '?'
 * getUsernameInitial('') // '?'
 * getUsernameInitial(undefined) // '?'
 */
export function getUsernameInitial(name: string) {
  if (!name?.trim()) {
    return 'UU'
  }

  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
}

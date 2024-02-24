import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    username: vine
      .string()
      .alphaNumeric({ allowSpaces: false, allowUnderscores: true, allowDashes: true }),
    password: vine.string().minLength(8).maxLength(64).confirmed(),
    rememberMeToken: vine.string().optional(),
  })
)

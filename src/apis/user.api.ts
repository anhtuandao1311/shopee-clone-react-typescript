import { User } from '~/types/user.type'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

interface UpdateProfileBody extends Omit<User, '_id' | 'roles' | 'email' | 'createdAt' | 'updatedAt'> {
  password?: string
  new_password?: string
}

const userApi = {
  getProfile: () => http.get<SuccessResponse<User>>('/user'),
  updateProfile: (body: UpdateProfileBody) => http.put<SuccessResponse<User>>('/user', body),
  uploadAvatar: (body: FormData) =>
    http.post<SuccessResponse<string>>('/user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}

export default userApi

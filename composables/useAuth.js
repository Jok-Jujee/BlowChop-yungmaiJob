import jwt_decode from "jwt-decode"

export default () => {
    /**
     * ใช้เพื่อเก็บสถานะของ token การยืนยันตัวตน
     * @returns {Ref<string>} - ค่า token การยืนยันตัวตน
     */
    const useAuthToken = () => useState('auth_token')

    /**
     * ใช้เพื่อเก็บสถานะของข้อมูลผู้ใช้
     * @returns {Ref<Object>} - ข้อมูลผู้ใช้
     */
    const useAuthUser = () => useState('auth_user')

    /**
     * ใช้เพื่อเก็บสถานะการโหลดข้อมูลการยืนยันตัวตน
     * @returns {Ref<boolean>} - สถานะการโหลดข้อมูล
     */
    const useAuthLoading = () => useState('auth_loading', () => true)

    /**
     * ตั้งค่า token การยืนยันตัวตนใหม่
     * @param {string} newToken - token การยืนยันตัวตนใหม่
     */
    const setToken = (newToken) => {
        const authToken = useAuthToken()
        authToken.value = newToken
    }

    /**
     * ตั้งค่าข้อมูลผู้ใช้ใหม่
     * @param {Object} newUser - ข้อมูลผู้ใช้ใหม่
     */
    const setUser = (newUser) => {
        const authUser = useAuthUser()
        authUser.value = newUser
    }

    /**
     * ตั้งค่าสถานะการโหลดข้อมูลการยืนยันตัวตน
     * @param {boolean} value - สถานะการโหลดข้อมูล
     */
    const setIsAuthLoading = (value) => {
        const authLoading = useAuthLoading()
        authLoading.value = value
    }

    /**
     * ฟังก์ชันสำหรับเข้าสู่ระบบ
     * @param {Object} param - ข้อมูลการเข้าสู่ระบบ
     * @param {string} param.username - ชื่อผู้ใช้
     * @param {string} param.password - รหัสผ่าน
     * @returns {Promise<boolean>} - ผลลัพธ์การเข้าสู่ระบบ
     */
    const login = ({ username, password }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch('/api/auth/login', {
                    method: 'POST',
                    body: {
                        username,
                        password
                    }
                })

                setToken(data.access_token)
                setUser(data.user)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * ฟังก์ชันสำหรับรีเฟรช token การยืนยันตัวตน
     * @returns {Promise<boolean>} - ผลลัพธ์การรีเฟรช token
     */
    const refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch('/api/auth/refresh')

                setToken(data.access_token)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
     * @returns {Promise<boolean>} - ผลลัพธ์การดึงข้อมูลผู้ใช้
     */
    const getUser = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await useFetchApi('/api/auth/user')

                setUser(data.user)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * ฟังก์ชันสำหรับรีเฟรช token การยืนยันตัวตนใหม่อัตโนมัติ
     */
    const reRefreshAccessToken = () => {
        const authToken = useAuthToken()

        if (!authToken.value) {
            return
        }

        const jwt = jwt_decode(authToken.value)

        const newRefreshTime = jwt.exp - 60000

        setTimeout(async () => {
            await refreshToken()
            reRefreshAccessToken()
        }, newRefreshTime);
    }

    /**
     * ฟังก์ชันสำหรับเริ่มต้นการยืนยันตัวตน
     * @returns {Promise<boolean>} - ผลลัพธ์การเริ่มต้นการยืนยันตัวตน
     */
    const initAuth = () => {
        return new Promise(async (resolve, reject) => {
            setIsAuthLoading(true)
            try {
                await refreshToken()
                await getUser()

                reRefreshAccessToken()

                resolve(true)
            } catch (error) {
                console.log(error)
                reject(error)
            } finally {
                setIsAuthLoading(false)
            }
        })
    }

    /**
     * ฟังก์ชันสำหรับออกจากระบบ
     * @returns {Promise<void>} - ผลลัพธ์การออกจากระบบ
     */
    const logout = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await useFetchApi('/api/auth/logout', {
                    method: 'POST'
                })

                setToken(null)
                setUser(null)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        login,
        useAuthUser,
        useAuthToken,
        initAuth,
        useAuthLoading,
        logout
    }
}
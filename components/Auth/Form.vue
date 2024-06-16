<template>
    <div class="w-full">
        <!-- <div class="flex justify-center">
            <div class="w-10 h-10">
                <img>
            </div>
        </div> -->

        <div class="pt-5 space-y-6">

            <UIInput v-model="data.username" label="Email" placeholder="@username" />

            <UIInput label="Password" placeholder="********" type="password" v-model="data.password" />


            <UIButton @click="handleLogin" liquid :disabled="isButtonDisabled">
                Login
            </UIButton>

        </div>
    </div>
</template>
<script setup>
/**
 * กำหนดข้อมูลเริ่มต้นสำหรับฟอร์มการเข้าสู่ระบบ
 * @property {string} username - ชื่อผู้ใช้ที่กรอกในฟอร์ม
 * @property {string} password - รหัสผ่านที่กรอกในฟอร์ม
 * @property {boolean} loading - สถานะการโหลดข้อมูล
 */
const data = reactive({
    username: '',
    password: '',
    loading: false
})

/**
 * ฟังก์ชันสำหรับจัดการการเข้าสู่ระบบ
 * เรียกใช้ฟังก์ชัน login จาก useAuth และส่งข้อมูลชื่อผู้ใช้และรหัสผ่าน
 * ตั้งค่าสถานะการโหลดข้อมูลเป็น true ขณะทำงาน และเป็น false เมื่อเสร็จสิ้น
 * @async
 * @function handleLogin
 */
 async function handleLogin() {
    data.loading = true
    try {
        const response = await fetch('https://9sk8wvgw-3000.asse.devtunnels.ms/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.username,
                password: data.password
            })
        })
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.message || 'Login failed')
        }
        console.log('Login successful', result)
    } catch (error) {
        console.log(error)
    } finally {
        data.loading = false
    }
}

/**
 * คำนวณสถานะของปุ่ม Login ว่าควรถูกปิดการใช้งานหรือไม่
 * ปุ่มจะถูกปิดการใช้งานหากชื่อผู้ใช้หรือรหัสผ่านว่าง หรืออยู่ในสถานะการโหลดข้อมูล
 * @computed
 * @returns {boolean} - สถานะการปิดการใช้งานของปุ่ม
 */
const isButtonDisabled = computed(() => {
    return (!data.username || !data.password) || data.loading
})

</script>
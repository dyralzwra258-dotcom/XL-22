/* =====================================================
   XL22 - DATABASE.JS
   قاعدة البيانات المحلية التجريبية
   ===================================================== */

const DB_KEYS = {
    USERS: "XL22_USERS",
    CURRENT_USER: "XL22_CURRENT_USER"
};


/* =====================================================
   قراءة جميع المستخدمين
===================================================== */

function getUsers() {

    try {

        const data = localStorage.getItem(DB_KEYS.USERS);

        if (!data) {
            return [];
        }

        const users = JSON.parse(data);

        if (!Array.isArray(users)) {
            return [];
        }

        return users;

    } catch (error) {

        console.error(
            "Database read error:",
            error
        );

        return [];

    }

}


/* =====================================================
   حفظ جميع المستخدمين
===================================================== */

function saveUsers(users) {

    try {

        localStorage.setItem(
            DB_KEYS.USERS,
            JSON.stringify(users)
        );

        return true;

    } catch (error) {

        console.error(
            "Database save error:",
            error
        );

        return false;

    }

}


/* =====================================================
   الحصول على رقم المستخدم الحالي
===================================================== */

function getCurrentUserIndex() {

    const index =
        localStorage.getItem(
            DB_KEYS.CURRENT_USER
        );

    if (
        index === null ||
        index === ""
    ) {

        return null;

    }

    const number =
        Number(index);

    if (
        Number.isNaN(number)
    ) {

        return null;

    }

    return number;

}


/* =====================================================
   حفظ المستخدم الحالي
===================================================== */

function setCurrentUserIndex(index) {

    localStorage.setItem(
        DB_KEYS.CURRENT_USER,
        String(index)
    );

}


/* =====================================================
   حذف المستخدم الحالي
   تسجيل الخروج
===================================================== */

function clearCurrentUser() {

    localStorage.removeItem(
        DB_KEYS.CURRENT_USER
    );

}


/* =====================================================
   الحصول على المستخدم الحالي
===================================================== */

function getCurrentUser() {

    const users =
        getUsers();

    const index =
        getCurrentUserIndex();

    if (
        index === null ||
        !users[index]
    ) {

        return null;

    }

    return users[index];

}


/* =====================================================
   تحديث المستخدم الحالي
===================================================== */

function updateCurrentUser(updatedUser) {

    const users =
        getUsers();

    const index =
        getCurrentUserIndex();

    if (
        index === null ||
        !users[index]
    ) {

        return false;

    }

    users[index] =
        updatedUser;

    return saveUsers(users);

}


/* =====================================================
   البحث عن مستخدم بواسطة ID
===================================================== */

function findUserById(id) {

    const users =
        getUsers();

    return users.find(
        user =>
            String(user.id) ===
            String(id)
    ) || null;

}


/* =====================================================
   البحث عن مستخدم بواسطة البريد أو الهاتف
===================================================== */

function findUserByIdentifier(identifier) {

    const users =
        getUsers();

    const search =
        String(identifier)
        .trim()
        .toLowerCase();

    return users.find(
        user =>
            String(
                user.identifier || ""
            )
            .trim()
            .toLowerCase()
            ===
            search
    ) || null;

}


/* =====================================================
   البحث عن رقم المستخدم بواسطة البريد أو الهاتف
===================================================== */

function findUserIndexByIdentifier(identifier) {

    const users =
        getUsers();

    const search =
        String(identifier)
        .trim()
        .toLowerCase();

    return users.findIndex(
        user =>
            String(
                user.identifier || ""
            )
            .trim()
            .toLowerCase()
            ===
            search
    );

}


/* =====================================================
   البحث عن مستخدم بواسطة كود الدعوة
===================================================== */

function findUserByReferralCode(code) {

    const users =
        getUsers();

    const search =
        String(code)
        .trim()
        .toUpperCase();

    return users.find(
        user =>
            String(
                user.referralCode || ""
            )
            .trim()
            .toUpperCase()
            ===
            search
    ) || null;

}


/* =====================================================
   البحث عن رقم المستخدم بواسطة كود الدعوة
===================================================== */

function findUserIndexByReferralCode(code) {

    const users =
        getUsers();

    const search =
        String(code)
        .trim()
        .toUpperCase();

    return users.findIndex(
        user =>
            String(
                user.referralCode || ""
            )
            .trim()
            .toUpperCase()
            ===
            search
    );

}


/* =====================================================
   إضافة مستخدم جديد
===================================================== */

function addUser(user) {

    const users =
        getUsers();

    users.push(user);

    const saved =
        saveUsers(users);

    if (!saved) {
        return null;
    }

    return users.length - 1;

}


/* =====================================================
   تحديث مستخدم بواسطة رقمه
===================================================== */

function updateUserByIndex(index, user) {

    const users =
        getUsers();

    if (
        index === null ||
        index < 0 ||
        !users[index]
    ) {

        return false;

    }

    users[index] =
        user;

    return saveUsers(users);

}


/* =====================================================
   إنشاء ID مستخدم
===================================================== */

function generateUserId() {

    return (
        Date.now()
        .toString()
        +
        Math.random()
        .toString(36)
        .substring(2, 8)
    );

}


/* =====================================================
   إنشاء كود دعوة
===================================================== */

function generateReferralCode() {

    const users =
        getUsers();

    let code;

    do {

        code =
            "XL22-" +
            Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    } while (
        users.some(
            user =>
                String(
                    user.referralCode || ""
                )
                .toUpperCase()
                ===
                code
        )
    );

    return code;

}


/* =====================================================
   إنشاء مستخدم جديد بشكل موحد
===================================================== */

function createUserData(
    identifier,
    password,
    referralCode = ""
) {

    return {

        id:
            generateUserId(),

        identifier:
            identifier,

        password:
            password,

        securityPin:
            "123456",

        referralCode:
            generateReferralCode(),

        invitedBy:
            referralCode || null,

        balance:
            0,

        taskProfit:
            0,

        referralProfit:
            0,

        depositProfit:
            0,

        withdrawalTotal:
            0,

        depositTotal:
            0,

        referralCount:
            0,

        teamDeposits:
            0,

        vip:
            0,

        verification:
            "غير موثق",

        tronAddress:
            "",

        language:
            "ar",

        profile:
            {
                name: "",
                phone: "",
                email: ""
            },

        transactions:
            [],

        messages:
            [],

        createdAt:
            new Date().toISOString()

    };

}


/* =====================================================
   إضافة معاملة للمستخدم الحالي
===================================================== */

function addTransaction(
    transaction
) {

    const users =
        getUsers();

    const index =
        getCurrentUserIndex();

    if (
        index === null ||
        !users[index]
    ) {

        return false;

    }

    if (
        !Array.isArray(
            users[index].transactions
        )
    ) {

        users[index].transactions =
            [];

    }

    users[index]
        .transactions
        .unshift(
            transaction
        );

    return saveUsers(users);

}


/* =====================================================
   إضافة رسالة للمستخدم الحالي
===================================================== */

function addMessage(
    message
) {

    const users =
        getUsers();

    const index =
        getCurrentUserIndex();

    if (
        index === null ||
        !users[index]
    ) {

        return false;

    }

    if (
        !Array.isArray(
            users[index].messages
        )
    ) {

        users[index].messages =
            [];

    }

    users[index]
        .messages
        .unshift(
            message
        );

    return saveUsers(users);

}


/* =====================================================
   مسح قاعدة البيانات التجريبية
===================================================== */

function resetDatabase() {

    localStorage.removeItem(
        DB_KEYS.USERS
    );

    localStorage.removeItem(
        DB_KEYS.CURRENT_USER
    );

    location.reload();

}


/* =====================================================
   تصدير نسخة احتياطية
===================================================== */

function exportDatabase() {

    const users =
        getUsers();

    const data =
        JSON.stringify(
            users,
            null,
            2
        );

    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "XL22-database-backup.json";

    link.click();

    URL.revokeObjectURL(
        url
    );

}


/* =====================================================
   نهاية قاعدة البيانات
===================================================== */

// ==========================================
// XL22 - DATABASE.JS
// قاعدة البيانات المحلية باستخدام LocalStorage
// ==========================================

let users = [];
let currentUserIndex = null;


// ------------------------------------------
// تحميل المستخدمين
// ------------------------------------------

function loadUsers() {

    try {

        const stored =
            localStorage.getItem("XL22_USERS");

        if (stored) {

            const parsed =
                JSON.parse(stored);

            if (Array.isArray(parsed)) {

                users = parsed;

            } else {

                users = [];

            }

        } else {

            users = [];

        }

    } catch (error) {

        console.error(
            "XL22: خطأ في تحميل المستخدمين",
            error
        );

        users = [];

    }
}


// ------------------------------------------
// حفظ المستخدمين
// ------------------------------------------

function saveUsers() {

    try {

        localStorage.setItem(
            "XL22_USERS",
            JSON.stringify(users)
        );

    } catch (error) {

        console.error(
            "XL22: خطأ في حفظ المستخدمين",
            error
        );

    }
}


// ------------------------------------------
// تحميل المستخدم الحالي
// ------------------------------------------

function loadCurrentUser() {

    const savedIndex =
        localStorage.getItem(
            "XL22_CURRENT_USER"
        );


    if (
        savedIndex === null ||
        savedIndex === ""
    ) {

        currentUserIndex = null;

        return;

    }


    const index =
        Number(savedIndex);


    if (
        Number.isInteger(index) &&
        users[index]
    ) {

        currentUserIndex =
            index;

    } else {

        currentUserIndex =
            null;

        localStorage.removeItem(
            "XL22_CURRENT_USER"
        );

    }

}


// ------------------------------------------
// تهيئة قاعدة البيانات
// ------------------------------------------

function initDatabase() {

    loadUsers();

    loadCurrentUser();

}


// ------------------------------------------
// مسح البيانات التجريبية
// ------------------------------------------

function resetDemoData() {

    const confirmed =
        confirm(
            "هل تريد حذف جميع الحسابات والبيانات المحلية؟"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "XL22_USERS"
    );


    localStorage.removeItem(
        "XL22_CURRENT_USER"
    );


    users = [];

    currentUserIndex = null;


    alert(
        "تم مسح البيانات بنجاح"
    );


    location.reload();

}


// ------------------------------------------
// تشغيل قاعدة البيانات عند تحميل الصفحة
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initDatabase();

    }
);

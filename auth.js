// ==========================================
// XL22 - AUTH.JS
// تسجيل الدخول + إنشاء الحساب + كود الدعوة
// ==========================================

/* ==========================================
   إظهار إنشاء الحساب
========================================== */

function showRegister() {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.classList.add("hidden");
    }

    if (registerForm) {
        registerForm.classList.remove("hidden");
    }

    if (typeof hideMessage === "function") {
        hideMessage("loginError");
        hideMessage("registerError");
    }
}


/* ==========================================
   إظهار تسجيل الدخول
========================================== */

function showLogin() {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.classList.add("hidden");
    }

    if (loginForm) {
        loginForm.classList.remove("hidden");
    }

    if (typeof hideMessage === "function") {
        hideMessage("loginError");
        hideMessage("registerError");
    }
}


/* ==========================================
   إظهار / إخفاء كلمة المرور
========================================== */

function togglePassword(id, button) {

    const input = document.getElementById(id);

    if (!input) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";

        if (button) {
            button.textContent = "🙈";
        }

    } else {

        input.type = "password";

        if (button) {
            button.textContent = "👁️";
        }
    }
}


/* ==========================================
   إنشاء كود دعوة فريد
========================================== */

function generateReferralCode() {

    let code;
    let exists = true;

    while (exists) {

        code =
            "XL22-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

        exists =
            Array.isArray(users) &&
            users.some(function(user) {

                return (
                    user &&
                    String(user.referralCode || "")
                        .toUpperCase()
                    ===
                    code
                );

            });
    }

    return code;
}


/* ==========================================
   إنشاء الحساب
========================================== */

function register() {

    const identifierInput =
        document.getElementById("registerIdentifier");

    const passwordInput =
        document.getElementById("registerPassword");

    const confirmInput =
        document.getElementById("registerConfirm");

    const referralInput =
        document.getElementById("registerReferral");


    if (
        !identifierInput ||
        !passwordInput ||
        !confirmInput
    ) {

        alert(
            "حدث خطأ في نموذج التسجيل. تأكد من ملف index.html"
        );

        return;
    }


    const identifier =
        identifierInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmInput.value;

    const referral =
        referralInput
        ?
        referralInput.value
            .trim()
            .toUpperCase()
        :
        "";


    if (typeof hideMessage === "function") {

        hideMessage("registerError");
        hideMessage("registerSuccess");

    }


    /* التحقق من الحقول */

    if (
        !identifier ||
        !password ||
        !confirmPassword
    ) {

        if (typeof showError === "function") {

            showError(
                "registerError",
                "يرجى تعبئة جميع الحقول المطلوبة"
            );

        } else {

            alert(
                "يرجى تعبئة جميع الحقول المطلوبة"
            );

        }

        return;
    }


    /* كلمة المرور */

    if (password.length < 6) {

        showErrorSafe(
            "registerError",
            "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
        );

        return;
    }


    /* تأكيد كلمة المرور */

    if (password !== confirmPassword) {

        showErrorSafe(
            "registerError",
            "كلمتا المرور غير متطابقتين"
        );

        return;
    }


    /* التأكد من وجود قاعدة المستخدمين */

    if (!Array.isArray(users)) {

        users = [];

    }


    /* التأكد من عدم تكرار الحساب */

    const exists =
        users.some(function(user) {

            if (!user) {
                return false;
            }

            return (
                String(user.identifier || "")
                    .trim()
                    .toLowerCase()
                ===
                identifier.toLowerCase()
            );

        });


    if (exists) {

        showErrorSafe(
            "registerError",
            "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقاً"
        );

        return;
    }


    /* إنشاء كود الدعوة */

    const referralCode =
        generateReferralCode();


    /* إنشاء المستخدم */

    const newUser = {

        id:
            Date.now().toString(),

        identifier:
            identifier,

        password:
            password,

        securityPin:
            "123456",

        referralCode:
            referralCode,

        invitedBy:
            null,

        balance:
            0,

        taskProfit:
            0,

        referralProfit:
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

        transactions:
            [],

        messages:
            [],

        createdAt:
            new Date().toISOString()

    };


    /* ==========================================
       معالجة كود الدعوة
    ========================================== */

    if (referral) {

        const inviterIndex =
            users.findIndex(function(user) {

                if (!user) {
                    return false;
                }

                return (
                    String(user.referralCode || "")
                        .trim()
                        .toUpperCase()
                    ===
                    referral
                );

            });


        if (inviterIndex !== -1) {

            newUser.invitedBy =
                referral;


            users[inviterIndex].referralCount =
                Number(
                    users[inviterIndex].referralCount || 0
                ) + 1;

        }

    }


    /* إضافة المستخدم */

    users.push(newUser);


    /* حفظ البيانات */

    if (typeof saveUsers === "function") {

        saveUsers();

    } else {

        localStorage.setItem(
            "XL22_USERS",
            JSON.stringify(users)
        );

    }


    /* تسجيل دخول المستخدم الجديد */

    currentUserIndex =
        users.length - 1;


    localStorage.setItem(
        "XL22_CURRENT_USER",
        String(currentUserIndex)
    );


    /* رسالة النجاح */

    if (typeof showRegisterSuccess === "function") {

        showRegisterSuccess(
            "registerSuccess",
            "تم إنشاء الحساب بنجاح! كود دعوتك الخاص هو: " +
            referralCode
        );

    }


    /* فتح التطبيق */

    setTimeout(function() {

        if (typeof openApp === "function") {

            openApp();

        } else {

            console.error(
                "XL22: الدالة openApp غير موجودة"
            );

            alert(
                "تم إنشاء الحساب بنجاح، لكن يوجد خطأ في فتح الصفحة الرئيسية. تأكد من ملف app.js"
            );

        }

    }, 500);

}


/* ==========================================
   تسجيل الدخول
========================================== */

function login() {

    const identifierInput =
        document.getElementById("loginIdentifier");

    const passwordInput =
        document.getElementById("loginPassword");


    if (
        !identifierInput ||
        !passwordInput
    ) {

        alert(
            "حدث خطأ في نموذج تسجيل الدخول. تأكد من ملف index.html"
        );

        return;
    }


    const identifier =
        identifierInput.value
            .trim()
            .toLowerCase();

    const password =
        passwordInput.value;


    if (typeof hideMessage === "function") {

        hideMessage("loginError");

    }


    /* التحقق من الحقول */

    if (
        !identifier ||
        !password
    ) {

        showErrorSafe(
            "loginError",
            "يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور"
        );

        return;
    }


    /* تحميل البيانات من LocalStorage */

    try {

        const stored =
            localStorage.getItem(
                "XL22_USERS"
            );


        if (stored) {

            const parsed =
                JSON.parse(stored);


            if (Array.isArray(parsed)) {

                users =
                    parsed;

            }

        }

    } catch (error) {

        console.error(
            "XL22 Login Error:",
            error
        );

        showErrorSafe(
            "loginError",
            "حدث خطأ في قراءة بيانات الحساب"
        );

        return;
    }


    /* التأكد من وجود المستخدمين */

    if (!Array.isArray(users)) {

        users = [];

    }


    /* البحث عن المستخدم */

    const index =
        users.findIndex(function(user) {

            if (!user) {
                return false;
            }


            const savedIdentifier =
                String(
                    user.identifier || ""
                )
                .trim()
                .toLowerCase();


            const savedPassword =
                String(
                    user.password || ""
                );


            return (
                savedIdentifier
                ===
                identifier
                &&
                savedPassword
                ===
                String(password)
            );

        });


    /* الحساب غير موجود */

    if (index === -1) {

        showErrorSafe(
            "loginError",
            "البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة"
        );

        return;
    }


    /* حفظ المستخدم الحالي */

    currentUserIndex =
        index;


    localStorage.setItem(
        "XL22_CURRENT_USER",
        String(currentUserIndex)
    );


    /* فتح التطبيق */

    if (typeof openApp === "function") {

        openApp();

    } else {

        alert(
            "تم تسجيل الدخول، لكن الدالة openApp غير موجودة في app.js"
        );

        console.error(
            "XL22 ERROR: openApp() غير موجودة"
        );

    }

}


/* ==========================================
   تسجيل الخروج
========================================== */

function logout() {

    currentUserIndex =
        null;


    localStorage.removeItem(
        "XL22_CURRENT_USER"
    );


    const app =
        document.getElementById("app");


    const authScreen =
        document.getElementById("authScreen");


    if (app) {

        app.classList.add("hidden");

    }


    if (authScreen) {

        authScreen.classList.remove("hidden");

    }


    const loginIdentifier =
        document.getElementById(
            "loginIdentifier"
        );


    const loginPassword =
        document.getElementById(
            "loginPassword"
        );


    if (loginIdentifier) {

        loginIdentifier.value = "";

    }


    if (loginPassword) {

        loginPassword.value = "";

    }


    showLogin();

}


/* ==========================================
   قراءة كود الدعوة من الرابط
   مثال:
   index.html?ref=XL22-ABC123
========================================== */

function loadReferralFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const referral =
        params.get("ref");


    if (!referral) {

        return;

    }


    const input =
        document.getElementById(
            "registerReferral"
        );


    if (input) {

        input.value =
            referral
                .trim()
                .toUpperCase();


        input.readOnly =
            true;


        input.style.borderColor =
            "var(--gold)";


        input.style.color =
            "var(--gold-light)";

    }


    showRegister();

}


/* ==========================================
   دالة آمنة لإظهار الخطأ
========================================== */

function showErrorSafe(
    id,
    message
) {

    if (typeof showError === "function") {

        showError(
            id,
            message
        );

        return;

    }


    const box =
        document.getElementById(id);


    if (!box) {

        alert(message);

        return;

    }


    box.textContent =
        message;


    box.classList.remove(
        "hidden"
    );

}


/* ==========================================
   عند تحميل الصفحة
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadReferralFromURL();

    }
);

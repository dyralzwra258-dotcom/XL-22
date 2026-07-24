// ==========================================
// XL22 - AUTH.JS
// تسجيل الدخول + إنشاء الحساب + كود الدعوة
// ==========================================

// ------------------------------------------
// إظهار شاشة إنشاء الحساب
// ------------------------------------------

function showRegister() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");

    hideMessage("loginError");
    hideMessage("registerError");
}


// ------------------------------------------
// إظهار شاشة تسجيل الدخول
// ------------------------------------------

function showLogin() {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");

    hideMessage("loginError");
    hideMessage("registerError");
}


// ------------------------------------------
// إظهار / إخفاء كلمة المرور
// ------------------------------------------

function togglePassword(id, button) {

    const input = document.getElementById(id);

    if (!input) return;

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


// ------------------------------------------
// إنشاء كود دعوة فريد
// ------------------------------------------

function generateReferralCode() {

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
                user.referralCode === code
        )
    );

    return code;
}


// ------------------------------------------
// إنشاء الحساب
// ------------------------------------------

function register() {

    const identifier =
        document
            .getElementById("registerIdentifier")
            .value
            .trim();

    const password =
        document
            .getElementById("registerPassword")
            .value;

    const confirmPassword =
        document
            .getElementById("registerConfirm")
            .value;

    const referral =
        document
            .getElementById("registerReferral")
            .value
            .trim()
            .toUpperCase();


    hideMessage("registerError");
    hideMessage("registerSuccess");


    // التحقق من الحقول

    if (
        !identifier ||
        !password ||
        !confirmPassword
    ) {

        showError(
            "registerError",
            "يرجى تعبئة جميع الحقول المطلوبة"
        );

        return;
    }


    // الحد الأدنى لكلمة المرور

    if (password.length < 6) {

        showError(
            "registerError",
            "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
        );

        return;
    }


    // تأكيد كلمة المرور

    if (password !== confirmPassword) {

        showError(
            "registerError",
            "كلمتا المرور غير متطابقتين"
        );

        return;
    }


    // التأكد من عدم وجود الحساب مسبقاً

    const exists =
        users.some(
            user =>
                String(user.identifier || "")
                    .trim()
                    .toLowerCase()
                ===
                identifier.toLowerCase()
        );


    if (exists) {

        showError(
            "registerError",
            "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقاً"
        );

        return;
    }


    // إنشاء كود الدعوة

    const referralCode =
        generateReferralCode();


    // إنشاء المستخدم

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


    // ------------------------------------------
    // معالجة كود الدعوة
    // ------------------------------------------

    if (referral) {

        const inviterIndex =
            users.findIndex(
                user =>
                    String(
                        user.referralCode || ""
                    )
                    .toUpperCase()
                    ===
                    referral
            );


        if (inviterIndex !== -1) {

            newUser.invitedBy =
                referral;

            users[inviterIndex]
                .referralCount =
                Number(
                    users[inviterIndex]
                        .referralCount || 0
                ) + 1;
        }
    }


    // إضافة المستخدم

    users.push(newUser);


    // حفظ البيانات

    saveUsers();


    // تسجيل دخول المستخدم الجديد

    currentUserIndex =
        users.length - 1;


    localStorage.setItem(
        "XL22_CURRENT_USER",
        String(currentUserIndex)
    );


    // إظهار رسالة النجاح

    showRegisterSuccess(
        "registerSuccess",
        "تم إنشاء الحساب بنجاح! كود دعوتك: " +
        referralCode
    );


    // فتح التطبيق بعد لحظة

    setTimeout(
        function () {

            openApp();

        },
        700
    );
}


// ------------------------------------------
// تسجيل الدخول
// ------------------------------------------

function login() {

    const identifier =
        document
            .getElementById("loginIdentifier")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    hideMessage("loginError");


    // التحقق من البيانات

    if (
        !identifier ||
        !password
    ) {

        showError(
            "loginError",
            "يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور"
        );

        return;
    }


    // تحميل آخر نسخة من المستخدمين

    try {

        const stored =
            localStorage.getItem(
                "XL22_USERS"
            );


        if (stored) {

            const parsed =
                JSON.parse(stored);


            if (Array.isArray(parsed)) {

                users = parsed;
            }
        }

    } catch (error) {

        console.error(
            "XL22 Login Data Error:",
            error
        );

        showError(
            "loginError",
            "حدث خطأ في قراءة بيانات الحساب"
        );

        return;
    }


    // البحث عن المستخدم

    const index =
        users.findIndex(
            function (user) {

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
                    identifier.toLowerCase()
                    &&
                    savedPassword
                    ===
                    String(password)
                );
            }
        );


    // المستخدم غير موجود

    if (index === -1) {

        showError(
            "loginError",
            "البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة"
        );

        return;
    }


    // حفظ المستخدم الحالي

    currentUserIndex =
        index;


    localStorage.setItem(
        "XL22_CURRENT_USER",
        String(index)
    );


    // فتح التطبيق

    openApp();
}


// ------------------------------------------
// تسجيل الخروج
// ------------------------------------------

function logout() {

    currentUserIndex = null;

    localStorage.removeItem(
        "XL22_CURRENT_USER"
    );


    document
        .getElementById("app")
        .classList.add("hidden");


    document
        .getElementById("authScreen")
        .classList.remove("hidden");


    // تنظيف حقول الدخول

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


// ------------------------------------------
// قراءة كود الدعوة من الرابط
// مثال:
// index.html?ref=XL22-ABC123
// ------------------------------------------

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

        // منع تغيير الكود
        // حتى يبقى كود الدعوة ثابتاً

        input.readOnly = true;

        input.style.borderColor =
            "var(--gold)";

        input.style.color =
            "var(--gold-light)";
    }


    // فتح التسجيل تلقائياً

    showRegister();
}


// ------------------------------------------
// عند تحميل الصفحة
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadReferralFromURL();

    }
);

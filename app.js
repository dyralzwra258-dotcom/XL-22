// ==========================================
// XL22 - APP.JS
// تشغيل التطبيق + لوحة التحكم + التنقل
// ==========================================


// ------------------------------------------
// الحصول على المستخدم الحالي
// ------------------------------------------

function getCurrentUser() {

    if (
        currentUserIndex === null ||
        currentUserIndex === undefined ||
        !users[currentUserIndex]
    ) {
        return null;
    }

    return users[currentUserIndex];
}


// ------------------------------------------
// فتح التطبيق
// ------------------------------------------

function openApp() {

    const user = getCurrentUser();

    if (!user) {

        console.warn(
            "XL22: لا يوجد مستخدم حالي"
        );

        return;
    }


    const authScreen =
        document.getElementById(
            "authScreen"
        );

    const app =
        document.getElementById(
            "app"
        );


    if (authScreen) {
        authScreen.classList.add(
            "hidden"
        );
    }


    if (app) {
        app.classList.remove(
            "hidden"
        );
    }


    // تحديث جميع بيانات الواجهة

    updateUI();


    // فتح الصفحة الرئيسية

    showPage(
        "home",
        document.querySelector(
            '.nav-item[onclick*="home"]'
        )
    );
}


// ------------------------------------------
// تحديث واجهة المستخدم بالكامل
// ------------------------------------------

function updateUI() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    // ======================================
    // الرصيد
    // ======================================

    const balance =
        Number(
            user.balance || 0
        );


    const homeBalance =
        document.getElementById(
            "homeBalance"
        );


    const balancePageValue =
        document.getElementById(
            "balancePageValue"
        );


    if (homeBalance) {

        homeBalance.textContent =
            balance.toFixed(2);

    }


    if (balancePageValue) {

        balancePageValue.textContent =
            balance.toFixed(2);

    }


    // ======================================
    // أرباح المهام
    // ======================================

    const taskProfit =
        Number(
            user.taskProfit || 0
        );


    const homeTaskProfit =
        document.getElementById(
            "homeTaskProfit"
        );


    const profitTask =
        document.getElementById(
            "profitTask"
        );


    if (homeTaskProfit) {

        homeTaskProfit.textContent =
            taskProfit.toFixed(2);

    }


    if (profitTask) {

        profitTask.textContent =
            taskProfit.toFixed(2);

    }


    // ======================================
    // أرباح الدعوات
    // ======================================

    const referralProfit =
        Number(
            user.referralProfit || 0
        );


    const homeReferralProfit =
        document.getElementById(
            "homeReferralProfit"
        );


    const profitReferral =
        document.getElementById(
            "profitReferral"
        );


    if (homeReferralProfit) {

        homeReferralProfit.textContent =
            referralProfit.toFixed(2);

    }


    if (profitReferral) {

        profitReferral.textContent =
            referralProfit.toFixed(2);

    }


    // ======================================
    // اسم المستخدم
    // ======================================

    const headerUser =
        document.getElementById(
            "headerUser"
        );


    if (headerUser) {

        headerUser.textContent =
            user.identifier || "مستخدم";

    }


    // ======================================
    // الصورة الشخصية
    // ======================================

    const avatar =
        document.getElementById(
            "avatar"
        );


    if (avatar) {

        avatar.textContent =
            String(
                user.identifier || "X"
            )
            .charAt(0)
            .toUpperCase();

    }


    // ======================================
    // إعدادات الملف الشخصي
    // ======================================

    const settingsIdentifier =
        document.getElementById(
            "settingsIdentifier"
        );


    if (
        settingsIdentifier &&
        document.activeElement !== settingsIdentifier
    ) {

        settingsIdentifier.value =
            user.identifier || "";

    }


    // ======================================
    // عنوان TRON
    // ======================================

    const tronAddress =
        document.getElementById(
            "tronAddress"
        );


    if (
        tronAddress &&
        document.activeElement !== tronAddress
    ) {

        tronAddress.value =
            user.tronAddress || "";

    }


    // ======================================
    // رابط الدعوة
    // ======================================

    updateReferralLink();


    // ======================================
    // تحديث الفريق
    // ======================================

    updateTeam();


    // ======================================
    // تحديث حالة التوثيق
    // ======================================

    updateVerificationStatus();


    // ======================================
    // عرض المعاملات
    // ======================================

    renderTransactions();
}


// ------------------------------------------
// إنشاء رابط الدعوة
// ------------------------------------------

function updateReferralLink() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const referralInput =
        document.getElementById(
            "referralLink"
        );


    if (!referralInput) {
        return;
    }


    const baseUrl =
        window.location.origin +
        window.location.pathname;


    const referralLink =
        baseUrl +
        "?ref=" +
        encodeURIComponent(
            user.referralCode || ""
        );


    referralInput.value =
        referralLink;
}


// ------------------------------------------
// نسخ رابط الدعوة
// ------------------------------------------

function copyReferralLink() {

    const input =
        document.getElementById(
            "referralLink"
        );


    if (!input) {
        return;
    }


    const text =
        input.value;


    if (!text) {

        alert(
            "رابط الدعوة غير متوفر"
        );

        return;
    }


    // استخدام Clipboard API

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(text)
            .then(
                function () {

                    alert(
                        "تم نسخ رابط الدعوة بنجاح"
                    );

                }
            )
            .catch(
                function () {

                    fallbackCopy(text);

                }
            );

    } else {

        fallbackCopy(text);

    }
}


// ------------------------------------------
// نسخ احتياطي للرابط
// ------------------------------------------

function fallbackCopy(text) {

    const temp =
        document.createElement(
            "textarea"
        );


    temp.value =
        text;


    temp.style.position =
        "fixed";


    temp.style.opacity =
        "0";


    document.body.appendChild(
        temp
    );


    temp.select();


    try {

        document.execCommand(
            "copy"
        );


        alert(
            "تم نسخ رابط الدعوة بنجاح"
        );

    } catch (error) {

        alert(
            "لم يتم نسخ الرابط، يرجى نسخه يدوياً"
        );

    }


    document.body.removeChild(
        temp
    );
}


// ------------------------------------------
// مشاركة رابط الدعوة
// ------------------------------------------

function shareReferral() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const baseUrl =
        window.location.origin +
        window.location.pathname;


    const link =
        baseUrl +
        "?ref=" +
        encodeURIComponent(
            user.referralCode || ""
        );


    const shareText =
        "انضم إلى منصة XL22 من خلال رابط الدعوة الخاص بي:";


    // دعم مشاركة الهاتف

    if (
        navigator.share
    ) {

        navigator.share({

            title:
                "XL22",

            text:
                shareText,

            url:
                link

        })
        .catch(
            function (error) {

                // المستخدم أغلق نافذة المشاركة
                console.log(
                    "Share cancelled",
                    error
                );

            }
        );


        return;
    }


    // إذا لم يكن Web Share API متاحاً

    const whatsappUrl =
        "https://wa.me/?text=" +
        encodeURIComponent(
            shareText +
            "\n" +
            link
        );


    window.open(
        whatsappUrl,
        "_blank"
    );
}


// ------------------------------------------
// تحديث معلومات الفريق
// ------------------------------------------

function updateTeam() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const count =
        Number(
            user.referralCount || 0
        );


    // ======================================
    // مستويات VIP
    // ======================================

    const vipLevels = [

        {
            level: 0,
            min: 0,
            next: 5,
            percent: 0
        },

        {
            level: 1,
            min: 5,
            next: 10,
            percent: 10
        },

        {
            level: 2,
            min: 10,
            next: 20,
            percent: 12
        },

        {
            level: 3,
            min: 20,
            next: 50,
            percent: 15
        },

        {
            level: 4,
            min: 50,
            next: 100,
            percent: 18
        },

        {
            level: 5,
            min: 100,
            next: 100,
            percent: 20
        }

    ];


    // ======================================
    // تحديد VIP الحالي
    // ======================================

    let currentVIP =
        0;


    for (
        let i = 0;
        i < vipLevels.length;
        i++
    ) {

        if (
            count >=
            vipLevels[i].min
        ) {

            currentVIP =
                vipLevels[i].level;

        }

    }


    const currentLevel =
        vipLevels[currentVIP];


    // ======================================
    // عدد الفريق
    // ======================================

    const teamCount =
        document.getElementById(
            "teamCount"
        );


    if (teamCount) {

        teamCount.textContent =
            count;

    }


    // ======================================
    // اسم VIP
    // ======================================

    const vipTitle =
        document.getElementById(
            "vipTitle"
        );


    if (vipTitle) {

        vipTitle.textContent =
            "VIP " +
            currentVIP;

    }


    // ======================================
    // نسبة VIP
    // ======================================

    const vipPercent =
        document.getElementById(
            "vipPercent"
        );


    if (vipPercent) {

        vipPercent.textContent =
            currentLevel.percent +
            "%";

    }


    // ======================================
    // حساب التقدم
    // ======================================

    let progress =
        0;


    if (
        currentVIP === 0
    ) {

        progress =
            (count / 5) * 100;

    } else if (
        currentVIP === 5
    ) {

        progress =
            100;

    } else {

        const previous =
            currentLevel.min;


        const target =
            currentLevel.next;


        progress =
            (
                (count - previous) /
                (target - previous)
            ) *
            100;

    }


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    // ======================================
    // شريط التقدم
    // ======================================

    const progressBar =
        document.getElementById(
            "teamProgress"
        );


    if (progressBar) {

        progressBar.style.width =
            progress +
            "%";

    }


    // ======================================
    // تفعيل مستويات VIP
    // ======================================

    const vipItems =
        document.querySelectorAll(
            ".vip-item"
        );


    vipItems.forEach(
        function (
            item,
            index
        ) {

            const level =
                index + 1;


            item.classList.toggle(
                "active",
                level <= currentVIP
            );

        }
    );
}


// ------------------------------------------
// تحديث حالة التوثيق
// ------------------------------------------

function updateVerificationStatus() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const element =
        document.getElementById(
            "verifyStatus"
        );


    if (!element) {
        return;
    }


    const status =
        user.verification ||
        "غير موثق";


    if (
        status ===
        "موثق"
    ) {

        element.textContent =
            "الحالة: موثق ✓";


        element.className =
            "verify-status status-approved";


    } else if (
        status ===
        "قيد المراجعة"
    ) {

        element.textContent =
            "الحالة: قيد المراجعة";


        element.className =
            "verify-status status-pending";


    } else {

        element.textContent =
            "الحالة: غير موثق";


        element.className =
            "verify-status status-pending";

    }
}


// ------------------------------------------
// التنقل بين الصفحات
// ------------------------------------------

function showPage(
    pageId,
    button
) {

    // إخفاء جميع الصفحات

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

            }
        );


    // فتح الصفحة المطلوبة

    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    // إزالة Active من القائمة

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    // تفعيل العنصر المحدد

    if (button) {

        button.classList.add(
            "active"
        );

    }


    // إغلاق القائمة على الهاتف

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    // تمرير الصفحة للأعلى

    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );
}


// ------------------------------------------
// التنقل من القائمة السفلية للموبايل
// ------------------------------------------

function mobilePage(
    pageId,
    button
) {

    showPage(
        pageId,
        null
    );


    // إزالة Active

    document
        .querySelectorAll(
            ".bottom-item"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    // تفعيل الزر الحالي

    if (button) {

        button.classList.add(
            "active"
        );

    }


    // مزامنة القائمة الجانبية

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            function (item) {

                const onclick =
                    item.getAttribute(
                        "onclick"
                    ) || "";


                item.classList.toggle(
                    "active",
                    onclick.includes(
                        "'" +
                        pageId +
                        "'"
                    )
                );

            }
        );
}


// ------------------------------------------
// فتح وإغلاق القائمة الجانبية
// ------------------------------------------

function toggleSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!sidebar) {
        return;
    }


    sidebar.classList.toggle(
        "open"
    );
}


// ------------------------------------------
// إغلاق القائمة عند الضغط خارجها
// ------------------------------------------

document.addEventListener(
    "click",
    function (event) {

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        const menuButton =
            document.querySelector(
                ".mobile-menu"
            );


        if (
            !sidebar ||
            !menuButton
        ) {
            return;
        }


        // فقط على الشاشات الصغيرة

        if (
            window.innerWidth <= 900
        ) {

            if (
                sidebar.classList.contains(
                    "open"
                ) &&
                !sidebar.contains(
                    event.target
                ) &&
                !menuButton.contains(
                    event.target
                )
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }

    }
);


// ------------------------------------------
// عند تغيير حجم الشاشة
// ------------------------------------------

window.addEventListener(
    "resize",
    function () {

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        if (!sidebar) {
            return;
        }


        if (
            window.innerWidth > 900
        ) {

            sidebar.classList.remove(
                "open"
            );

        }

    }
);

// ==========================================
// XL22 - سجل السحب
// ==========================================

// الحصول على سجل السحب للمستخدم الحالي
function getWithdrawHistory() {

    const user = getCurrentUser();

    if (!user) {
        return [];
    }

    if (!Array.isArray(user.withdrawHistory)) {
        user.withdrawHistory = [];
    }

    return user.withdrawHistory;
}


// ==========================================
// إضافة عملية سحب إلى السجل
// ==========================================

function addWithdrawRecord(amount, status) {

    const user = getCurrentUser();

    if (!user) {
        return;
    }

    if (!Array.isArray(user.withdrawHistory)) {
        user.withdrawHistory = [];
    }

    const record = {

        amount: Number(amount || 0),

        status: status || "فشل",

        date: new Date().toLocaleString(
            "ar-SA",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        )

    };

    user.withdrawHistory.unshift(record);

    // حفظ البيانات
    if (typeof saveData === "function") {
        saveData();
    }

    renderWithdrawHistory();
}


// ==========================================
// عرض سجل السحب
// ==========================================

function renderWithdrawHistory() {

    const container =
        document.getElementById(
            "withdrawHistory"
        );

    if (!container) {
        return;
    }

    const history =
        getWithdrawHistory();

    // لا يوجد سجل
    if (
        history.length === 0
    ) {

        container.innerHTML = `

            <div class="withdraw-empty">

                لا توجد عمليات سحب حتى الآن

            </div>

        `;

        return;
    }


    container.innerHTML =
        history.map(
            function(record) {

                const status =
                    record.status === "مكتمل"
                        ? "مكتمل"
                        : "فشل";

                const statusClass =
                    record.status === "مكتمل"
                        ? "withdraw-complete"
                        : "withdraw-failed";


                return `

                    <div class="withdraw-record">

                        <div class="withdraw-record-info">

                            <div class="withdraw-record-title">

                                سحب

                            </div>

                            <div class="withdraw-record-date">

                                ${record.date}

                            </div>

                        </div>


                        <div class="withdraw-record-amount">

                            $${Number(
                                record.amount || 0
                            ).toFixed(2)}

                        </div>


                        <div
                            class="withdraw-status ${statusClass}"
                        >

                            ${status}

                        </div>

                    </div>

                `;

            }
        )
        .join("");
}


// ==========================================
// تحديث سجل السحب مع تحديث الواجهة
// ==========================================

const oldUpdateUI =
    window.updateUI;

window.updateUI =
    function() {

        if (
            typeof oldUpdateUI ===
            "function"
        ) {

            oldUpdateUI();

        }

        renderWithdrawHistory();

    };


// ==========================================
// تشغيل السجل عند فتح الصفحة
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            function() {

                renderWithdrawHistory();

            },
            300
        );

    }
);

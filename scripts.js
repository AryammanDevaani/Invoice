const clientData = {
    subhash: {
        name: "Subhash Studios Private Limited",
        address: "201, Nimbus Centre, Plot Number 69\nOberoi Complex, Near Laxmi Industrial Estate\nAndheri West, Mumbai-53",
        contact: "9930405505",
        gst: "27AABCS1126R1Z3"
    },
    zibanka: {
        name: "Zibanka Media Services Private Limited",
        address: "Unit no. 21, 2nd floor, Techniplex Towers 1\nNext to Witty International school, Pawan Baug\nGoregaon West, Mumbai-64",
        contact: "",
        gst: ""
    }
};

function getValueOrDash(el) {
    return el.value.trim() || "-";
}

function fillClientData() {
    const sel = document.getElementById("clientSelect").value;
    if (sel === "subhash") {
        document.getElementById("clientName").value = clientData.subhash.name;
        document.getElementById("clientContact").value = clientData.subhash.contact;
        document.getElementById("clientAddress").value = clientData.subhash.address;
        document.getElementById("clientGST").value = clientData.subhash.gst;
    } else if (sel === "zibanka") {
        document.getElementById("clientName").value = clientData.zibanka.name;
        document.getElementById("clientContact").value = clientData.zibanka.contact;
        document.getElementById("clientAddress").value = clientData.zibanka.address;
        document.getElementById("clientGST").value = clientData.zibanka.gst;
    } else {
        document.getElementById("clientName").value = "";
        document.getElementById("clientContact").value = "";
        document.getElementById("clientAddress").value = "";
        document.getElementById("clientGST").value = "";
    }
}

function createRow(isFirst = false) {
    const row = document.createElement("div");
    row.classList.add("dubbing-row");
    row.innerHTML = `
        <label>date <span style="color:red">*</span></label>
        <input type="date" class="dubDate" required>
        <label>series/movie's name</label>
        <input class="seriesName">
        <label>character(s) voiced</label>
        <input class="characters">
        <label>director</label>
        <input class="director">
        <label>episode(s)</label>
        <input class="episodes">
        <label>amount (₹)</label>
        <input type="number" class="amount">
    `;
    
    if (!isFirst) {
        const btn = document.createElement("button");
        btn.textContent = "delete";
        btn.className = "deleteBtn";
        btn.onclick = () => row.remove();
        row.appendChild(btn);
    }
    
    return row;
}

function addRow() {
    document.getElementById("dubbingRows").appendChild(createRow());
}

function fillInvoiceTable() {
    const table = document.getElementById("invoiceTable");
    table.innerHTML = "";
    let total = 0;
    const rows = document.querySelectorAll("#dubbingRows .dubbing-row");
    
    for (let r of rows) {
        const dateEl = r.querySelector(".dubDate");
        if (!dateEl.value.trim()) {
            alert("All projects must have a date filled in.");
            return false;
        }
        
        const date = new Date(dateEl.value).toLocaleDateString("en-GB", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric" 
        }).split("/").join("-");
        
        const series = getValueOrDash(r.querySelector(".seriesName"));
        const chars = getValueOrDash(r.querySelector(".characters"));
        const dir = getValueOrDash(r.querySelector(".director"));
        const eps = getValueOrDash(r.querySelector(".episodes"));
        const amt = r.querySelector(".amount").value.trim() || "-";
        
        if (amt !== "-") total += parseFloat(amt);
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${date}</td>
            <td>${series}</td>
            <td>${chars}</td>
            <td>${dir}</td>
            <td>${eps}</td>
            <td>${amt}</td>
        `;
        table.appendChild(tr);
    }
    
    document.getElementById("outTotal").textContent = total.toFixed(2);
    return true;
}

async function generateInvoice() {
    if (!fillInvoiceTable()) return;
    
    document.getElementById("invoiceDate").textContent = new Date().toLocaleDateString("en-GB", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
    }).split("/").join("-");
    
    document.getElementById("outClientName").textContent = getValueOrDash(document.getElementById("clientName"));
    document.getElementById("outClientContact").textContent = getValueOrDash(document.getElementById("clientContact"));
    document.getElementById("outClientAddress").textContent = getValueOrDash(document.getElementById("clientAddress"));
    document.getElementById("outClientGST").textContent = getValueOrDash(document.getElementById("clientGST"));
    
    const el = document.getElementById("invoice");
    el.style.display = "block";
    await new Promise(r => requestAnimationFrame(r));
    
    const opt = {
        filename: "Jullie_Devaani_Invoice.pdf",
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] }
    };
    
    await html2pdf().set(opt).from(el).save();
    el.style.display = "none";
}

window.onload = () => {
    document.getElementById("dubbingRows").appendChild(createRow(true));
};

window.addEventListener("scroll", () => {
    const btn = document.getElementById("topGenerateBtn");
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        btn.style.display = "inline-block";
        btn.disabled = false;
    }
});

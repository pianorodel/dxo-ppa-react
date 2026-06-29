import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./style.css";

const FilePreview = ({ state, handleHidePreview }) => {
  const totalDebit = state.rowData.reduce((sum, row) => sum + parseFloat(row.debit || 0), 0);

  const totalCredit = state.rowData.reduce((sum, row) => sum + parseFloat(row.credit || 0), 0);

  const handleDownloadPdf = () => {
    const element = document.querySelector(".voucher-wrapper");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "voucher.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
    toast(`Voucher was successfully downloaded.`, {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      className: "bg-success text-white",
    });
  };

  const handlePrintPdf = () => {
    const pri = document.createElement("iframe");
    pri.style.position = "absolute";
    pri.style.width = "0px";
    pri.style.height = "0px";
    pri.style.border = "none";
    document.body.appendChild(pri);

    const priDoc = pri.contentWindow || pri.contentDocument;
    const doc = priDoc.document || priDoc;

    let styles = "";
    document.querySelectorAll("style, link[rel='stylesheet']").forEach((style) => {
      styles += style.outerHTML;
    });

    doc.open();
    doc.write(`
    <html>
      <head>
        ${styles}
        <style>
          .supporting-table th {
            background-color: #f2f2f2;
            text-align: left;
          }
         .table-header th {
            background-color: #f2f2f2;
          }
          @page {
            size: auto;
            margin: 0;
          }
          body {
             margin: 10mm; /* padding sa print */
          }
        </style>
      </head>
      <body>
         ${document.querySelector(".voucher-wrapper").outerHTML}
      </body>
    </html>
  `);
    doc.close();

    pri.contentDocument.title = "";

    pri.onload = () => {
      pri.contentWindow.focus();
      pri.contentWindow.print();
      document.body.removeChild(pri);
    };
  };

  return (
    <div className="file-preview-container" style={{ minHeight: state.toggleExpand ? "85vh" : "" }}>
      <div
        className="d-flex align-items-center justify-content-between "
        style={{
          width: "100%",
          height: "40px",
          background: "#3c3c3c",
          color: "white",
          paddingLeft: "12px",
          paddingRight: "15px",
          fontSize: "13px",
        }}>
        <div>
          <button
            onClick={handleHidePreview}
            type="button"
            className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
            id="topnav-hamburger-icon">
            <span className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <div style={{ paddingTop: "4px" }}>Journal Entry Voucher Preview</div>
        <div style={{ paddingTop: "4px" }}>
          <i className="bx bx-download" onClick={handleDownloadPdf} style={{ fontSize: "15px", cursor: "pointer" }}>
            {" "}
          </i>
          <i onClick={handlePrintPdf} className="bx bx-printer " style={{ fontSize: "15px", marginLeft: "10px", cursor: "pointer" }}>
            {" "}
          </i>
        </div>
      </div>
      <div className="voucher-wrapper-outside">
        <div className="voucher-wrapper">
          <table className="main-table" style={{ background: "white", color: "black" }}>
            <tbody>
              <tr>
                <td colSpan="6" className="no-border">
                  <table className="header-table">
                    <tbody>
                      <tr>
                        <td className="header-left">
                          <div>Journal Entry Voucher</div>
                          <br />
                          <div>
                            PHILIPPINE SPORTS COMMISSION
                          </div>
                        </td>
                        <td className="header-mid">
                          <div>
                            <strong>Funding Source:</strong>
                          </div>
                          <div>{state.data.selectedFundCode || "-"}</div>
                          <div>{state.data.selectedFund || "-"}</div>
                          <div>Transaction Type:</div>
                          <div>COL001 - Collection - Traffic Violation Fees</div>
                          <br />
                        </td>
                        <td className="header-right">
                          <div>
                            <strong>No.:</strong> JEV-2025-07-004525
                          </div>
                          <div>
                            <strong>Date:</strong>
                            {state.data.date || "-"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr className="table-header">
                <th
                  style={{
                    paddingLeft: "6px",
                    paddingBottom: "6px",
                    paddingTop: "6px",
                  }}>
                  Responsibility Center
                </th>
                <th
                  style={{
                    paddingLeft: "6px",
                    paddingBottom: "6px",
                    paddingTop: "6px",
                  }}>
                  Account Title
                </th>
                <th
                  style={{
                    paddingLeft: "6px",
                    paddingBottom: "6px",
                    paddingTop: "6px",
                  }}>
                  Account Code
                </th>
                <th
                  style={{
                    paddingLeft: "6px",
                    paddingBottom: "6px",
                    paddingTop: "6px",
                  }}>
                  Sub-Object Code
                </th>
                <th
                  style={{
                    paddingLeft: "6px",
                    paddingBottom: "6px",
                    paddingTop: "6px",
                  }}>
                  Debit
                </th>
                <th
                  style={{
                    paddingLeft: "6px",
                    paddingBottom: "6px",
                    paddingTop: "6px",
                  }}>
                  Credit
                </th>
              </tr>

              {state.rowData?.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      paddingLeft: "6px",
                      paddingBottom: "6px",
                      paddingTop: "6px",
                    }}>
                    {row.responsibilityCenter?.label || ""}
                  </td>
                  <td
                    style={{
                      paddingLeft: "6px",
                      paddingBottom: "6px",
                      paddingTop: "6px",
                    }}>
                    {row.accountTitle}
                  </td>
                  <td
                    style={{
                      paddingLeft: "6px",
                      paddingBottom: "6px",
                      paddingTop: "6px",
                    }}>
                    {row.accountCode}
                  </td>
                  <td
                    style={{
                      paddingLeft: "6px",
                      paddingBottom: "6px",
                      paddingTop: "6px",
                    }}>
                    {row.subObject?.label || ""}
                  </td>
                  <td className="text-right" style={{ padding: "6px" }}>
                    {parseFloat(row.debit || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-right" style={{ padding: "6px" }}>
                    {parseFloat(row.credit || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}

              <tr className="total-row">
                <td colSpan="4" className="text-right" style={{ padding: "6px" }}>
                  {" "}
                  <strong>TOTAL</strong>
                </td>
                <td className="text-right" style={{ padding: "6px" }}>
                  <strong>
                    {" "}
                    ₱
                    {parseFloat(totalDebit || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                  </strong>
                </td>
                <td className="text-right" style={{ padding: "6px" }}>
                  <strong>
                    {" "}
                    ₱
                    {parseFloat(totalCredit || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </td>
              </tr>

              <tr>
                <td colSpan="6" className="no-border">
                  <div className="supporting-docs">
                    <strong>Supporting Documents:</strong>
                    <table className="supporting-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Document No.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                          { date: "2022-01-01", codeDescription: "Description", documentNo: "123" },
                        ]?.map((row, index) => (
                          <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.codeDescription}</td>
                            <td> {row.documentNo} </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan="6" className="no-border">
                  <div className="particulars" style={{ minHeight: "100%" }}>
                    <strong>Particulars:</strong>
                    <br />
                    <div style={{ whiteSpace: "pre-wrap" }}> {state.data.particural || " - "}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              fontSize: "9px",
            }}>
            <div style={{ textAlign: "left" }}>
              <p>Prepared by:</p>
              <div
                style={{
                  borderTop: "1px solid black",
                  width: "100px",
                  margin: "0 auto",
                }}></div>
              <p>
                <strong>SANTOS, MARIA L.</strong>
              </p>
            </div>
            <div style={{ textAlign: "left" }}>
              <p>Approved by:</p>
              <div
                style={{
                  borderTop: "1px solid black",
                  width: "100px",
                  margin: "0 auto",
                }}></div>
              <p>
                <strong>JUAN DELA CRUZ</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

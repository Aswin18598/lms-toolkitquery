import { PDFDocument } from "pdf-lib";

const imageUrl = import.meta.env.VITE_APP_IMG_URL;

const setFormFieldDetails = (form: any, formField: string, CertificateInfo: any) => {
	switch (formField) {
		case "Name":
			if (+CertificateInfo.UserName !== -1) {
				form.getTextField("Name").setText(CertificateInfo.UserName);
			}
			break;
		case "CertImage":
			if (+CertificateInfo.LogoFile !== -1) {
				form.getTextField("CertImage").setImage(imageUrl + CertificateInfo.LogoFile);
			}
			break;
		case "OrganizationName":
			if (+CertificateInfo.OrganizationName !== -1) {
				form.getTextField("OrganizationName").setText(CertificateInfo.OrganizationName);
			}
			break;
		case "SoftwareAssessment":
			if (+CertificateInfo.ItemName !== -1) {
				form.getTextField("SoftwareAssessment").setText(CertificateInfo.ItemName);
			}
			break;
		case "Date":
			if (+CertificateInfo.CompletedDate !== -1) {
				form.getTextField("Date").setText(CertificateInfo.CompletedDate);
			}
			break;
		case "Serialno":
			if (+CertificateInfo.Prefix !== -1) {
				form.getTextField("Serialno").setText(CertificateInfo.Prefix);
			}
			break;
		default:
			break;
	}
};

const CertificateDownload = async (CertificateInfo: any) => {
	const formUrl = "/assets/Certificate_Templates/Contents/" + CertificateInfo.TemplateFileName.replace("\\\\", "/");
	const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

	const pdfDoc = await PDFDocument.load(formPdfBytes);

	const form = pdfDoc.getForm();
	form.getFields().map((field: any) => {
		setFormFieldDetails(form, field.getName(), CertificateInfo);
		field.enableReadOnly();
	});
	const pdfView: any = await pdfDoc.saveAsBase64({ dataUri: true });
	const a = document.createElement("a");
	a.setAttribute("href", pdfView);
	a.download = CertificateInfo.UserName + " - " + CertificateInfo.ItemName + ".pdf";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

export default CertificateDownload;

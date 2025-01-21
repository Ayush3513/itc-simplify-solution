import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/Layout/MainLayout";

export default function InvoiceUpload() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Function to upload the file and process it using Mindee API
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("document", file);

        // Step 1: Make the API request to upload the document
        const response = await fetch(
          "https://api.mindee.net/v1/products/gstnnnnnnn/invoice_calc/v1/predict_async", // Correct URL for async prediction
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: "Token 1c159ed6727d707620f8ffd39456a7d5", // Replace with your actual API key
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Step 2: Extract the job_id from the response
        const jobId = data.job.id;
        if (!jobId) {
          throw new Error("Job ID not found in the response.");
        }

        console.log("Job ID:", jobId); // Log for debugging

        // Step 3: Start polling for the job status
        await pollJobStatus(jobId);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error processing invoice",
          description:
            error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [toast]
  );

  // Function to poll job status
  const pollJobStatus = async (jobId: string) => {
    try {
      const pollingInterval = 5000; // Poll every 5 seconds to give the system time to process

      const fetchJobStatus = async () => {
        const response = await fetch(
          `https://api.mindee.net/v1/products/gstnnnnnnn/invoice_calc/v1/documents/queue/${jobId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Token 1c159ed6727d707620f8ffd39456a7d5", // Replace with your actual API key
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Polling response:", data);

        const jobStatus = data.job.status;

        if (jobStatus === "success" || jobStatus === "completed") {
          console.log("Job finished, fetching prediction data...");
          await fetchPredictionData(jobId); // Fetch the prediction results
        } else if (jobStatus === "waiting" || jobStatus === "processing") {
          console.log("Job is still processing, retrying...");
          setTimeout(fetchJobStatus, pollingInterval); // Retry after the defined interval
        } else {
          throw new Error(`Job failed with status: ${jobStatus}`);
        }
      };

      // Start polling
      fetchJobStatus();
    } catch (error) {
      console.error("Error polling job status:", error);
      toast({
        title: "Error checking job status",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Function to retrieve the prediction data using job ID
 const fetchPredictionData = async (jobId: string) => {
   const maxRetries = 5;
   let retryCount = 0;

   const fetchWithRetry = async () => {
     try {
       const response = await fetch(
         `https://api.mindee.net/v1/products/gstnnnnnnn/invoice_calc/v1/documents/queue/${jobId}`,
         {
           method: "GET",
           headers: {
             Authorization: "Token 1c159ed6727d707620f8ffd39456a7d5", // Replace with your actual API key
           },
         }
       );

       if (!response.ok) {
         if (response.status === 429 && retryCount < maxRetries) {
           // Apply backoff if rate limit is exceeded
           retryCount++;
           const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
           console.log(`Rate limit hit. Retrying in ${backoffTime / 1000}s...`);
           setTimeout(fetchWithRetry, backoffTime);
           return;
         }
         throw new Error(`HTTP error! Status: ${response.status}`);
       }

       const data = await response.json();
       console.log("Prediction Data:", data);

       const importantData = data.document.inference.prediction;

       // Step 4: Set the extracted data to the state for further use
       if (importantData && importantData.invoicenumber) {
        
         setInvoiceData({
           invoiceNumber: importantData.invoicenumber?.value || "",
           invoiceDate: importantData.invoice_date?.value || "",
           buyerGstin: importantData.buyergstin?.value || "",
           supplierGstin: importantData.suppliergstin?.value || "",
           taxAmount: {
             cgst: importantData.taxamount?.cgst || "",
             sgst: importantData.taxamount?.sgst || "",
             igst: importantData.taxamount?.igst || "",
             totalAmount: importantData.taxamount?.total_amount || "",
             withoutTax: importantData.taxamount?.without_tax || "",
           },
         });

         toast({
           title: "Invoice processed successfully",
           description: `Extracted data for invoice: ${
             importantData.invoicenumber?.value || "Unknown"
           }`,
         });
       } else {
         console.log("Prediction data is still empty or incomplete.");
       }
     } catch (error) {
       console.error("Error fetching prediction data:", error);
       toast({
         title: "Error fetching prediction",
         description:
           error instanceof Error ? error.message : "Please try again later.",
         variant: "destructive",
       });
     }
   };

   fetchWithRetry();
 };

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <MainLayout>
      <Card className="p-6">
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center ${
            isUploading ? "opacity-50" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {isUploading ? (
                "Processing invoice..."
              ) : (
                <>
                  Drag and drop your invoice files here, or{" "}
                  <label className="text-primary hover:text-primary/80 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                      disabled={isUploading}
                    />
                  </label>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>
      </Card>

      {/* Render invoice data */}
      {invoiceData && (
        <div className="mt-6 p-4 border-t-2 border-gray-300">
          <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
          <p>
            <strong>Invoice Number:</strong> {invoiceData.invoiceNumber}
          </p>
          <p>
            <strong>Invoice Date:</strong> {invoiceData.invoiceDate}
          </p>
          <p>
            <strong>Buyer GSTIN:</strong> {invoiceData.buyerGstin}
          </p>
          <p>
            <strong>Supplier GSTIN:</strong> {invoiceData.supplierGstin}
          </p>
          <p>
            <strong>Taxable Amount (without tax):</strong>{" "}
            {invoiceData.taxAmount.withoutTax}
          </p>
          <p>
            <strong>Total Amount:</strong> {invoiceData.taxAmount.totalAmount}
          </p>

          {/* Tax Amount */}
          <div className="mt-2">
            <h3 className="font-medium">Tax Amount:</h3>
            <p>
              <strong>CGST:</strong> {invoiceData.taxAmount.cgst}
            </p>
            <p>
              <strong>SGST:</strong> {invoiceData.taxAmount.sgst}
            </p>
            <p>
              <strong>IGST:</strong> {invoiceData.taxAmount.igst}
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

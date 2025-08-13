# CU Enrollment Verification Letter Generator

This project is a Google Cloud Run function designed to generate Chamberlain University (CU) enrollment verification letters in PDF format.

## Overview

The application exposes an HTTP endpoint that, when provided with a valid JSON Web Token (JWT), generates a personalized enrollment verification letter. It uses a Mustache template to populate the letter with student-specific data from the JWT, then leverages Puppeteer to render the HTML into a PDF, which is returned as a downloadable file.

## Features

- **PDF Generation**: Dynamically creates PDF documents from HTML.
- **JWT-based Data**: Populates the letter content from a secure JWT payload.
- **Templating**: Uses Mustache.js for easy and maintainable HTML templating.
- **Cloud-Ready**: Built as a Google Cloud Function for easy deployment and scaling.

## Technology Stack

- **Backend**: Node.js
- **Framework**: Google Cloud Functions Framework
- **PDF Generation**: Puppeteer
- **Templating**: Mustache.js
- **Authentication**: JSON Web Token (jsonwebtoken)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd cu-enrollment-verification
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the function on your local machine, run the following command:

```bash
npm start
```

This will start a local server, typically on `http://localhost:8080`.

## Usage

The application has a single endpoint for generating the verification letter.

- **Endpoint**: `GET /export/enrollmentVerification`
- **Query Parameter**: `token` (string, required) - A valid JWT containing the student's data.

### JWT Payload

The JWT payload must contain the following fields, which correspond to the variables in the template:

```json
{
  "DATE": "August 25, 2023",
  "NAME": "Gwowen",
  "ADDRESS": "123 Main St",
  "ADDRESS_CONT": "Apt 4B",
  "CITY": "Anytown",
  "STATE": "CA",
  "ZIP_CODE": "12345",
  "DEGREE_PROGRAM": "Bachelor of Science in Nursing",
  "CONCENTRATION": "",
  "ENROLLMENT_STATUS": "Full-Time",
  "SESSION_NAME": "Fall 2023",
  "SEMESTER_START_DATE": "September 1, 2023",
  "SEMESTER_END_DATE": "December 15, 2023",
  "COMB_ACADEMIC_STANDING": "in Good Standing",
  "HAS_OR_HAS_NOT": "has",
  "CONFERRAL_DATE": "May 1, 2024"
}
```
**Note**: The `CONFERRAL_DATE` is optional. If it's an empty string or not present, the corresponding paragraph will not be included in the letter.

### Example Request

Here is an example of how to generate a token and use `curl` to request a letter.

1.  **Generate a token** (you can use a site like [jwt.io](https://jwt.io) for testing):
    -   **Header**: `{"alg": "HS256", "typ": "JWT"}`
    -   **Payload**: Use the JSON structure above.
    -   **Secret**: `Adtalem123` (as hardcoded in `enrollmentVerification.js`)

2.  **Make the request**:
    ```bash
    curl -o enrollment_verification.pdf "http://localhost:8080/export/enrollmentVerification?token=<YOUR_GENERATED_JWT>"
    ```
    Replace `<YOUR_GENERATED_JWT>` with the token you generated. This command will save the generated PDF as `enrollment_verification.pdf`.

## Security Note

For development purposes, the JWT secret is hardcoded in `enrollmentVerification.js`. For a production environment, it is strongly recommended to use environment variables to manage secrets.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
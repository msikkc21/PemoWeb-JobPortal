import React from "react";
import { Link } from "@inertiajs/react";

export default function Show({ resume }) {
    return (
        <div>
            <h1>Detail Resume</h1>

            <p><strong>ID:</strong> {resume.id}</p>
            <p><strong>File:</strong> {resume.cv_file}</p>
            <p><strong>Upload Date:</strong> {resume.upload_date}</p>

            <h3>Parsed Data</h3>
            <pre className="bg-gray-100 p-3 rounded">
                {resume.parsed_data || "Belum diparsing"}
            </pre>

            <Link
                href={route("jobseeker.resumes.index")}
                className="btn btn-secondary"
            >
                Kembali
            </Link>
        </div>
    );
}

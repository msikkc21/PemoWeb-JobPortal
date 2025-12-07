import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Edit({ resume }) {
    const [file, setFile] = useState(null);
    const [parsed, setParsed] = useState(resume.parsed_data || "");

    const submit = (e) => {
        e.preventDefault();

        router.post(route("jobseeker.resumes.update", resume.id), {
            _method: "PUT",
            cv_file: file,
            parsed_data: parsed,
        });
    };

    return (
        <div>
            <h1>Edit Resume</h1>

            <form onSubmit={submit} encType="multipart/form-data">
                <label>Upload File Baru (Opsional):</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />

                <label>Parsed Data (Opsional):</label>
                <textarea
                    value={parsed}
                    onChange={(e) => setParsed(e.target.value)}
                    className="w-full h-40"
                />

                <button type="submit" className="btn btn-primary mt-3">
                    Simpan
                </button>
            </form>
        </div>
    );
}

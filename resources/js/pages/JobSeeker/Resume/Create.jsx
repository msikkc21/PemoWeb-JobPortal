import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Create() {
    const [file, setFile] = useState(null);

    const submit = (e) => {
        e.preventDefault();

        router.post(route("jobseeker.resumes.store"), {
            cv_file: file,
        });
    };

    return (
        <div>
            <h1>Upload Resume Baru</h1>

            <form onSubmit={submit} encType="multipart/form-data">
                <label>Upload CV:</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />

                <button type="submit" className="btn btn-success">
                    Upload
                </button>
            </form>
        </div>
    );
}

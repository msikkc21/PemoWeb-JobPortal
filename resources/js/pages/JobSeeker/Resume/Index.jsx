import React from "react";
import { Link, router } from "@inertiajs/react";

export default function Index({ resumes }) {
    return (
        <div>
            <h1>Daftar Resume</h1>

            <Link
                href={route("jobseeker.resumes.create")}
                className="btn btn-primary"
            >
                Upload Resume Baru
            </Link>

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>File</th>
                        <th>Upload Date</th>
                        <th>Parsed?</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {resumes.map((resume) => (
                        <tr key={resume.id}>
                            <td>{resume.id}</td>
                            <td>{resume.cv_file}</td>
                            <td>{resume.upload_date}</td>
                            <td>{resume.parsed_data ? "✔" : "✖"}</td>
                            <td>
                                <Link href={route("jobseeker.resumes.show", resume.id)}>
                                    Detail
                                </Link>{" "}
                                |{" "}
                                <Link href={route("jobseeker.resumes.edit", resume.id)}>
                                    Edit
                                </Link>{" "}
                                |{" "}
                                <button
                                    className="text-red-600"
                                    onClick={() =>
                                        router.delete(route("jobseeker.resumes.destroy", resume.id))
                                    }
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

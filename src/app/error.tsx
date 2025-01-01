'use client';

import NextError from "next/error";

const Error = ({ error }: { error: Error }) => {
    return (
        <NextError title={error.message} statusCode={500} />
    )
}

export default Error

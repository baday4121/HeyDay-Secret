<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ErrorController extends Controller
{
    public function show($status = 404)
    {
        $message = match ((int)$status) {
            400 => 'Bad Request. The server could not understand the request.',
            401 => 'Unauthorized. Please log in to access this page.',
            403 => 'Access Forbidden. You do not have permission to view this page.',
            404 => 'Oops! The page or resource you are looking for could not be found.',
            408 => 'Request Timeout. The server timed out waiting for the request.',
            429 => 'Too Many Requests. You are sending too many requests in a given amount of time.',
            500 => 'Internal Server Error. Something went wrong on our server.',
            502 => 'Bad Gateway. The server received an invalid response from the upstream server.',
            503 => 'Service Unavailable. The server is currently overloaded or down for maintenance.',
            504 => 'Gateway Timeout. The upstream server failed to send a request in time.',
            default => 'An unexpected error occurred.',
        };

        return view('errors.errors', [
            'status' => $status,
            'message' => $message
        ]);
    }
}
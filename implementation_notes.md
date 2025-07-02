# Implementation Notes

## Overview

This is a minimal implementation of the provided take-home assignment spec. The application uses a modern web stack (React/Next.js/PostgreSQL) to process CSV files containing ambiguous, messy, and potentially invalid corporate entity information. The system intelligently normalizes user-uploaded data using the OpenAI API and basic heuristics.

No information is destroyed in this normalisation procedure; the original data always remains fully intact in the raw_json field, ensuring that as the software grows more sophisticated, it is possible to enhance existing rows in place.

It then allows users to query uploaded data with a minimalist grid using TanStack Table and three key filters for domain name, country of origin, and number of employees.

## Design Decisions

### Duplicate Handling Strategy

The specification requires "graceful" duplicate handling. Given the inherent non-determinism of LLM-powered normalization, I adopted as conservative an approach as possible.

More concretely, as LLMs could theoretically produce different results for similar entities (e.g., "Company X LLC" vs "Company X, Plc" might represent distinct legal entities in different jurisdictions), I decided to accept potential duplicates rather than risk incorrect entity merging. Each record receives a random UUID primary key, preserving all user-provided data.

### Employee Count Processing

Non-parsable employee counts default to the "<10" bucket. While the specification allows empty values for 'city etc', it explicitly defines employee count buckets. This ensures all records have valid employee count classifications.

## Development Constraints

I have tried to complete this to the extent possible in less than three hours. If I had more time, my first priorities would be writing some basic unit tests for the data cleanup operations and integration tests (using Playwright, Cypress, or similar) for the front-end. 
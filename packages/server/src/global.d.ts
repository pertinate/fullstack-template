declare namespace NodeJS {
    interface ProcessEnv {
        ENVIRONMENT: 'development' | 'stage' | 'production'
        DATABASE_URL: string
    }
}

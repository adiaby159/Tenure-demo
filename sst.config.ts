/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'tenure',
      // Retain resources in production so a failed deploy doesn't destroy data.
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },

  async run() {
    const web = new sst.aws.Nextjs('Tenure', {
      environment: {
        DATABASE_URL: process.env.DATABASE_URL!,
      },
    })

    // Expose the CloudFront URL as a named output — captured by the CI workflow.
    return {
      CloudFrontUrl: web.url,
    }
  },
})

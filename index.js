let AWS = require('aws-sdk');
let cloudfront = new AWS.CloudFront();

exports.handler = async (event) => {
    return new Promise((resolve, reject) => {
        let message = JSON.parse(event.Records[0].Sns.Message);
        let dimensions = message.Trigger.Dimensions;

        let distribution = 0;

        dimensions.forEach(value => {
            if (value.name === "DistributionId") {
                distribution = value.value;
            }
        });

        if (distribution === 0) {
            return reject(
                this.buildResponse('error', 'Could not find distribution.')
            );
        }

        let getDistributionConfigPromise = cloudfront.getDistributionConfig({Id: distribution}).promise();
        getDistributionConfigPromise.then((configurationData) => {

            if (configurationData.DistributionConfig.Enabled === false) {
                return resolve(
                    this.buildResponse('success', 'Distribution is already disabled')
                );
            }

            let updateDistributionConfigPromise = cloudfront.updateDistribution(this.modifyConfiguration(distribution, configurationData)).promise();
            updateDistributionConfigPromise.then((updateResponse) => {
                return resolve(
                    this.buildResponse('success', updateResponse)
                );
            });
        });
    });
};

exports.modifyConfiguration = (distributionId, configuration) => {
    configuration.DistributionConfig.Enabled = false;
    configuration.Id = distributionId;
    configuration.IfMatch = configuration.ETag;
    delete configuration.ETag;

    return configuration;
};

exports.buildResponse = (status, message) => {
    return {
        'status': status,
        'message': message
    };
};
#!/usr/bin/env bash
#shellcheck disable=SC2039

starttime=`date +%s`

while [ $(( $(date +%s) - 300 )) -lt ${starttime} ]; do

    consumer_status=`kubectl get pods -l "water-safety-plan-version=$CI_COMMIT,run=akvo-webform" -o jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}'`

    old_consumer_status=`kubectl get pods -l "water-safety-plan-version!=$CI_COMMIT,run=akvo-webform" -o jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}'`

    if [[ ${consumer_status} =~ "ready=true" ]] && ! [[ ${old_consumer_status} =~ "ready" ]]; then
        exit 0
    else
        echo "Waiting for the containers to be ready"
        sleep 10
    fi
done

echo "Containers not ready after 5 minutes or old containers not stopped"

kubectl get pods -l "run=water-safety-plan" -o jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}'

exit 1


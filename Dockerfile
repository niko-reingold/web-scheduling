FROM java:openjdk-8-jdk

ADD target/dropwizard-example-1.1.0-SNAPSHOT.jar /data/dropwizard-example-1.1.0-SNAPSHOT.jar

ADD src/main/resources/assets /data/assets

ADD example.openshift.yml /data/example.yml

RUN ["java", "-jar", "/data/dropwizard-example-1.1.0-SNAPSHOT.jar", "db", "migrate", "/data/example.yml"]

USER 1001

CMD ["java", "-jar", "/data/dropwizard-example-1.1.0-SNAPSHOT.jar", "server", "/data/example.yml"]

EXPOSE 8080

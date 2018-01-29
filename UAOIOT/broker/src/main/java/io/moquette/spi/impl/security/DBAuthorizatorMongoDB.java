/*
 * Copyright (c) 2012-2017 The original author or authors
 * ------------------------------------------------------
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Apache License v2.0 which accompanies this distribution.
 *
 * The Eclipse Public License is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * The Apache License v2.0 is available at
 * http://www.opensource.org/licenses/apache2.0.php
 *
 * You may elect to redistribute this code under either of these licenses.
 */
package io.moquette.spi.impl.security;

import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.MongoException;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.model.Filters;
import static com.mongodb.client.model.Filters.eq;
import io.moquette.BrokerConstants;
import io.moquette.server.config.IConfig;
import static io.moquette.spi.impl.security.Authorization.Permission.READWRITE;
import io.moquette.spi.impl.subscriptions.Topic;
import io.moquette.spi.security.IAuthorizator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.sql.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.bson.Document;

/**
 * Load user credentials from a SQL database. sql driver must be provided at
 * runtime
 */
public class DBAuthorizatorMongoDB implements IAuthorizator {

    MongoClient mongoAuthorizatorClient = new MongoClient(new ServerAddress("localhost", 27017));
//    mongoClient.getDatabase (
//    "uaoiotmqtt").getCollection("customers").insertOne(new Document("nam1", "jhon"));
//    System.out.println (
//    "Conexion creada con la base de datos");

//    public static MongoClient mongoAuthorizatorClient = new MongoClient("localhost", 27017);
//    private static final Logger LOG = LoggerFactory.getLogger(DBAuthorizatorMongoDB.class);
//    private Map<String, List<Authorization>> m_userAuthorizations = new HashMap<>();
//    private final PreparedStatement preparedStatement;
    public DBAuthorizatorMongoDB(IConfig conf) {
        try {
            boolean databaseExist = false;
            MongoIterable<String> collectionNames = mongoAuthorizatorClient.getDatabase("uaoiotmqtt").listCollectionNames();
            MongoCursor<String> iterator = collectionNames.iterator();
            while (iterator.hasNext()) {
                if (iterator.next().equals("acls")) {
                    databaseExist = true;
                }
            }
            if (!databaseExist) {
                mongoAuthorizatorClient.getDatabase("uaoiotmqtt").getCollection("acls").insertOne(new Document("user", "user1").append("topic", "test1").append("permission", "READWRITE"));
                mongoAuthorizatorClient.getDatabase("uaoiotmqtt").getCollection("acls").insertOne(new Document("user", "user1").append("topic", "test2").append("permission", "READ"));
                mongoAuthorizatorClient.getDatabase("uaoiotmqtt").getCollection("acls").insertOne(new Document("user", "user2").append("topic", "test2").append("permission", "READWRITE"));
            }
        } catch (MongoException e) {

        }

    }

    /**
     * provide authenticator from SQL database
     *
     * @param driver : jdbc driver class like : "org.postgresql.Driver"
     * @param jdbcUrl : jdbc url like : "jdbc:postgresql://host:port/dbname"
     * @param sqlQuery : sql query like : "SELECT PASSWORD FROM USER WHERE
     * LOGIN=?"
     */
    public DBAuthorizatorMongoDB(String driver, String jdbcUrl, String sqlQuery) {

    }

    @Override
    public boolean canWrite(Topic topic, String user, String client) {
        return canDoOperation(topic, Authorization.Permission.WRITE, user, client);
    }

    @Override
    public boolean canRead(Topic topic, String user, String client) {
        return canDoOperation(topic, Authorization.Permission.READ, user, client);
    }

    private boolean canDoOperation(Topic topic, Authorization.Permission permission, String username, String client) {
        try {
            Document document = mongoAuthorizatorClient.getDatabase("uaoiotmqtt").getCollection("acls").find(Filters.and(Filters.eq("user", username), Filters.eq("topic", topic.toString()))).first();
            if (document != null) {
                String p = document.getString("permission");
                Authorization.Permission permissionTemp = Authorization.Permission.valueOf(p);
                if (permissionTemp == permission || permissionTemp == READWRITE) {
                    return true;
                }
            }
            return false;
        } catch (MongoException e) {
            return false;
        }
    }
}

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
import com.mongodb.MongoSocketOpenException;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoIterable;
import static com.mongodb.client.model.Filters.eq;
import io.moquette.BrokerConstants;
import io.moquette.server.config.IConfig;
import io.moquette.spi.security.IAuthenticator;
import java.net.ConnectException;
import org.apache.commons.codec.binary.Hex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.Arrays;
import java.util.logging.Level;
import org.bson.Document;

/**
 * Load user credentials from a SQL database. sql driver must be provided at
 * runtime
 */
public class DBAuthenticatorMongoDB implements IAuthenticator {

    MongoClient mongoAuthenticatorClient = new MongoClient(new ServerAddress("localhost", 27017));

    public DBAuthenticatorMongoDB(IConfig conf) {
        try {
            boolean databaseExist = false;
            MongoIterable<String> collectionNames = mongoAuthenticatorClient.getDatabase("uaoiotmqtt").listCollectionNames();
            MongoCursor<String> iterator = collectionNames.iterator();
            while (iterator.hasNext()) {
                if (iterator.next().equals("users")) {
                    databaseExist = true;
                }
            }
            if (!databaseExist) {
                mongoAuthenticatorClient.getDatabase("uaoiotmqtt").getCollection("users").insertOne(new Document("login", "user1").append("password", "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"));
                mongoAuthenticatorClient.getDatabase("uaoiotmqtt").getCollection("users").insertOne(new Document("login", "user2").append("password", "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"));
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
     * @param digestMethod : password encoding algorithm : "MD5", "SHA-1",
     * "SHA-256"
     */
    public DBAuthenticatorMongoDB(String driver, String jdbcUrl, String sqlQuery, String digestMethod) {

    }

    @Override
    public synchronized boolean checkValid(String clientId, String username, byte[] password) {
        try {
            // Check Username / Password in DB using sqlQuery
            if (username == null || password == null) {
//            LOG.info("username or password was null");
                return false;
            }
            Document document = null;
            try {
                document = mongoAuthenticatorClient.getDatabase("uaoiotmqtt").getCollection("users").find(eq("login", username)).first();
            } catch (Exception ex) {

            }
            if (document != null) {

                try {
                    String foundPassword = document.getString("password");
                    MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
                    messageDigest.update(password);
                    byte[] digest = messageDigest.digest();
                    String encodedPasswd = new String(Hex.encodeHex(digest));
                    return foundPassword.equals(encodedPasswd);
                } catch (NoSuchAlgorithmException ex) {
                    java.util.logging.Logger.getLogger(DBAuthenticatorMongoDB.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            return false;
        } catch (MongoException e) {
            return false;
        }

    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
    }
}

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

import io.moquette.BrokerConstants;
import io.moquette.server.config.IConfig;
import static io.moquette.spi.impl.security.Authorization.Permission.READWRITE;
import io.moquette.spi.impl.subscriptions.Topic;
import io.moquette.spi.security.IAuthorizator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.sql.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Load user credentials from a SQL database. sql driver must be provided at
 * runtime
 */
public class DBAuthorizatorMySQL implements IAuthorizator {

    private static final Logger LOG = LoggerFactory.getLogger(DBAuthorizatorMySQL.class);
    private Map<String, List<Authorization>> m_userAuthorizations = new HashMap<>();
    private final PreparedStatement preparedStatement;

    public DBAuthorizatorMySQL(IConfig conf) {
        this(
                conf.getProperty(BrokerConstants.DB_AUTHORIZATOR_DRIVER, ""),
                conf.getProperty(BrokerConstants.DB_AUTHORIZATOR_URL, ""),
                conf.getProperty(BrokerConstants.DB_AUTHORIZATOR_QUERY, "")
        );
    }

    /**
     * provide authenticator from SQL database
     *
     * @param driver : jdbc driver class like : "org.postgresql.Driver"
     * @param jdbcUrl : jdbc url like : "jdbc:postgresql://host:port/dbname"
     * @param sqlQuery : sql query like : "SELECT PASSWORD FROM USER WHERE
     * LOGIN=?"
     */
    public DBAuthorizatorMySQL(String driver, String jdbcUrl, String sqlQuery) {

        try {
            Class.forName(driver);
            final Connection connection = DriverManager.getConnection(jdbcUrl);
            this.preparedStatement = connection.prepareStatement(sqlQuery);
        } catch (ClassNotFoundException cnfe) {
            LOG.error(String.format("Can't find driver %s", driver), cnfe);
            throw new RuntimeException(cnfe);
        } catch (SQLException sqle) {
            LOG.error(String.format("Can't connect to %s", jdbcUrl), sqle);
            throw new RuntimeException(sqle);
        }
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

        ResultSet r = null;
        try {
            this.preparedStatement.setString(1, username);
            this.preparedStatement.setString(2, topic.toString());
            r = this.preparedStatement.executeQuery();
            if (r.next()) {
                Authorization.Permission permissionTemp = Authorization.Permission.valueOf(r.getString(1));
                if (permissionTemp == permission || permissionTemp == READWRITE) {
                    return true;
                }
            }
            r.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }
}

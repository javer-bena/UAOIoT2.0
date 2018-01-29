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
package io.moquette.persistence;

import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import io.moquette.spi.IMatchingCondition;
import io.moquette.spi.IMessagesStore;
import io.moquette.spi.impl.subscriptions.Topic;
import java.text.SimpleDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import org.bson.Document;

public class MemoryMessagesStore implements IMessagesStore {

    MongoClient mongoMessageStore = new MongoClient(new ServerAddress("localhost", 27017));

    private static final Logger LOG = LoggerFactory.getLogger(MemoryMessagesStore.class);

    private Map<Topic, StoredMessage> m_retainedStore = new HashMap<>();

    MemoryMessagesStore() {
    }

    @Override
    public void initStore() {
    }

    @Override
    public void storeRetained(Topic topic, StoredMessage storedMessage) {
        LOG.debug("Store retained message for topic={}, CId={}", topic, storedMessage.getClientID());
        if (storedMessage.getClientID() == null) {
            throw new IllegalArgumentException("Message to be persisted must have a not null client ID");
        }
        m_retainedStore.put(topic, storedMessage);
    }

    @Override
    public Collection<StoredMessage> searchMatching(IMatchingCondition condition) {
        LOG.debug("searchMatching scanning all retained messages, presents are {}", m_retainedStore.size());

        List<StoredMessage> results = new ArrayList<>();

        for (Map.Entry<Topic, StoredMessage> entry : m_retainedStore.entrySet()) {
            StoredMessage storedMsg = entry.getValue();
            if (condition.match(entry.getKey())) {
                results.add(storedMsg);
            }
        }

        return results;
    }

    @Override
    public void cleanRetained(Topic topic) {
        m_retainedStore.remove(topic);
    }

    @Override
    public void storeMessage(Topic topic, StoredMessage storedMessage) {
        byte[] messageBytes;
        if (storedMessage.getPayload().hasArray()) {
            messageBytes = storedMessage.getPayload().array();
        } else {
            messageBytes = new byte[storedMessage.getPayload().readableBytes()];
            storedMessage.getPayload().readBytes(messageBytes);
        }
        String payload = new String(messageBytes);
        String pattern = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        String date = simpleDateFormat.format(new Date());
        try {
            mongoMessageStore.getDatabase("uaoiotmqtt").getCollection("messages").
                    insertOne(new Document("topic", topic.toString())
                            .append("user", storedMessage.getUserName())
                            .append("payload", payload)
                            .append("clientID", storedMessage.getClientID())
                            .append("qos", storedMessage.getQos().ordinal())
                            .append("publicationDate", date));
        } catch (Exception e) {

        }
    }
}

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
package io.moquette.persistence.h2;

import io.moquette.spi.IMatchingCondition;
import io.moquette.spi.IMessagesStore;
import io.moquette.spi.MessageGUID;
import io.moquette.spi.impl.subscriptions.Topic;
import org.h2.mvstore.Cursor;
import org.h2.mvstore.MVMap;
import org.h2.mvstore.MVStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

class H2MessagesStore implements IMessagesStore {

    private static final Logger LOG = LoggerFactory.getLogger(H2MessagesStore.class);

    private final MVStore mvStore;

    // maps clientID -> guid
    private MVMap<Topic, MessageGUID> retainedStore;
    // maps guid to message, it's message store
    private MVMap<MessageGUID, StoredMessage> persistentMessageStore;

    private MVMap<Topic, StoredMessage> new_retainedStore;

    public H2MessagesStore(MVStore mvStore) {
        this.mvStore = mvStore;
    }

    @Override
    public void initStore() {
        retainedStore = mvStore.openMap("retained");
        persistentMessageStore = mvStore.openMap("oldPersistedMessages");
        new_retainedStore = mvStore.openMap("persistedMessages");
        LOG.info("Initialized message H2 store");
    }

    @Override
    public void storeRetained(Topic topic, StoredMessage storedMessage) {
        LOG.debug("Store retained message for topic={}, CId={}", topic, storedMessage.getClientID());
        if (storedMessage.getClientID() == null) {
            throw new IllegalArgumentException( "Message to be persisted must have a not null client ID");
        }
        new_retainedStore.put(topic, storedMessage);
    }

    @Override
    public Collection<StoredMessage> searchMatching(IMatchingCondition condition) {
        LOG.debug("Scanning retained messages");
        List<StoredMessage> results = new ArrayList<>();

        Cursor<Topic, MessageGUID> mapCursor = retainedStore.cursor(null);
        while (mapCursor.hasNext()) {
            final MessageGUID guid = mapCursor.getValue();
            final Topic topic = mapCursor.getKey();
            StoredMessage storedMsg = persistentMessageStore.get(guid);
            if (condition.match(topic)) {
                results.add(storedMsg);
            }
        }

        if (LOG.isTraceEnabled()) {
            LOG.trace("Retained messages have been scanned matchingMessages={}", results);
        }

        return results;
    }

    @Override
    public void cleanRetained(Topic topic) {
        LOG.debug("Cleaning retained messages. Topic={}", topic);
        retainedStore.remove(topic);
    }

    @Override
    public void storeMessage(Topic topic, StoredMessage storedMessage) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}

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
package io.moquette.testembedded;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import io.moquette.interception.AbstractInterceptHandler;
import io.moquette.interception.InterceptHandler;
import io.moquette.interception.messages.InterceptConnectMessage;
import io.moquette.interception.messages.InterceptConnectionLostMessage;
import io.moquette.interception.messages.InterceptDisconnectMessage;
import io.moquette.interception.messages.InterceptPublishMessage;
import io.moquette.interception.messages.InterceptSubscribeMessage;
import io.moquette.interception.messages.InterceptUnsubscribeMessage;
import io.moquette.server.Server;
import io.moquette.server.config.ClasspathResourceLoader;
import io.moquette.server.config.IConfig;
import io.moquette.server.config.IResourceLoader;
import io.moquette.server.config.ResourceLoaderConfig;
import io.netty.buffer.Unpooled;
import io.netty.handler.codec.mqtt.MqttMessageBuilders;
import io.netty.handler.codec.mqtt.MqttPublishMessage;
import io.netty.handler.codec.mqtt.MqttQoS;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import org.bson.Document;
import org.bson.types.ObjectId;

public class EmbeddedLauncher extends AbstractInterceptHandler {

    private IConfig conf;
    private Server mqttBroker = new Server();


    public static void main(String[] args) throws InterruptedException, IOException {
        new EmbeddedLauncher();
    }

    private EmbeddedLauncher() throws InterruptedException {
        try {
            IResourceLoader classpathLoader = new ClasspathResourceLoader();
            conf = new ResourceLoaderConfig(classpathLoader);
            List<? extends InterceptHandler> userHandlers = Collections.singletonList(this);
            mqttBroker.startServer(conf, userHandlers);

            System.out.println("Broker started press [CTRL+C] to stop");
            //Bind  a shutdown hook
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Stopping broker");
                mqttBroker.stopServer();
                System.out.println("Broker stopped");
            }));

            Thread.sleep(1000);
            System.out.println("Before self publish");
            MqttPublishMessage message = MqttMessageBuilders.publish()
                    .topicName("/exit")
                    .retained(true)
                    //        qos(MqttQoS.AT_MOST_ONCE);
                    //        qQos(MqttQoS.AT_LEAST_ONCE);
                    .qos(MqttQoS.EXACTLY_ONCE)
                    .payload(Unpooled.copiedBuffer("Hello World!!".getBytes()))
                    .build();
            mqttBroker.internalPublish(message, "INTRLPUB");
            System.out.println("After self publish");
            //  mqttBroker.getProcessor().

//        while(true){
//            Thread.sleep(5000);
//            mqttBroker.getSubscriptions();
//        }
        } catch (IOException ex) {
            Logger.getLogger(EmbeddedLauncher.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    public String getID() {
        return "EmbeddedLauncherPublishListener";
    }

    @Override
    public void onPublish(InterceptPublishMessage msg) {
        byte[] messageBytes;
        if (msg.getPayload().hasArray()) {
            messageBytes = msg.getPayload().array();
        } else {
            messageBytes = new byte[msg.getPayload().readableBytes()];
            msg.getPayload().readBytes(messageBytes);
        }
        System.out.println("Received on topic: " + msg.getTopicName() + " content: " + new String(messageBytes));
    }

    @Override
    public void onConnect(InterceptConnectMessage msg) {
        System.out.println("Connectado->" + msg.getUsername() + "-" + msg.getClientID());
    }

    @Override
    public void onDisconnect(InterceptDisconnectMessage msg) {
        System.out.println("Disconnect->" + msg.getUsername() + "-" + msg.getClientID());
    }

    @Override
    public void onConnectionLost(InterceptConnectionLostMessage msg) {
        System.out.println("ConectionLost->" + msg.getUsername() + "-" + msg.getClientID());
    }

    @Override
    public void onSubscribe(InterceptSubscribeMessage msg) {
        System.out.println("OnSubscribe->" + msg.getUsername() + "-" + msg.getClientID() + "-" + msg.getTopicFilter());
    }

    @Override
    public void onUnsubscribe(InterceptUnsubscribeMessage msg) {
        System.out.println("UnSubscribe->" + msg.getUsername() + "-" + msg.getClientID() + "-" + msg.getTopicFilter());
    }
}

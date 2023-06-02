package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;

@RestClientTest(SetCowHealthJobFactory.class)
@AutoConfigureDataJpa
public class SetCowHealthJobFactoryTests {

    @MockBean
    CommonsRepository commonsRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    UserRepository userRepository;

    @Autowired
    SetCowHealthJobFactory setCowHealthJobFactory;

    @Test
    void test_create() throws Exception {
        double newCowHealth = 50;
        // Act
        SetCowHealthJob setCowHealthJob = (SetCowHealthJob) setCowHealthJobFactory.create(newCowHealth);

        // Assert
        assertEquals(commonsRepository,setCowHealthJob.getCommonsRepository());
        assertEquals(userCommonsRepository,setCowHealthJob.getUserCommonsRepository());
        assertEquals(userRepository,setCowHealthJob.getUserRepository());

    }
}


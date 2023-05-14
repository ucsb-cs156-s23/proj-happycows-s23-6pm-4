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

@RestClientTest(MilkTheCowsJobFactory.class)
@AutoConfigureDataJpa
public class MilkTheCowsJobFactoryTests {

    @MockBean
    CommonsRepository commonsRepository;

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    UserRepository userRepository;

    @Autowired
    MilkTheCowsJobFactory MilkTheCowsJobFactory;

    @Test
    void test_create() throws Exception {

        // Act
        MilkTheCowsJob MilkTheCowsJob = MilkTheCowsJobFactory.create();

        // Assert
        assertEquals(commonsRepository,MilkTheCowsJob.getCommonsRepository());
        assertEquals(userCommonsRepository,MilkTheCowsJob.getUserCommonsRepository());
        assertEquals(userRepository,MilkTheCowsJob.getUserRepository());

    }
}


package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.User;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class SetCowHealthJobTests {
        @Mock
        CommonsRepository commonsRepository;

        @Mock
        UserCommonsRepository userCommonsRepository;

        @Mock
        UserRepository userRepository;

        private User user = User
                        .builder()
                        .id(1L)
                        .fullName("Chris Gaucho")
                        .email("cgaucho@example.org")
                        .build();

        @Test
        void test_log_output_success() throws Exception {

            // Arrange
            Job jobStarted = Job.builder().build();
            JobContext ctx = new JobContext(null, jobStarted);

            // Act
            SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository, userRepository, 50);
            setCowHealthJob.accept(ctx);

            // Assert
            String expected = """
                            Updating cow health...
                            Cow health has been updated!""";

            assertEquals(expected, jobStarted.getLog());
        }

        @Test
        void test_setting_to_new_values() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(10)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(1)
                                .cowHealth(50)
                                .build();

                double newCowHealth = 50;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository, userRepository, newCowHealth);
                setCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 1, cowHealth: 10.0
                                 old cow health: 10.0, new cow health: 50.0
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_setting_to_zero() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(10)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(1)
                                .cowHealth(0)
                                .build();

                double newCowHealth = 0;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository, userRepository, newCowHealth);
                setCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 1, cowHealth: 10.0
                                 old cow health: 10.0, new cow health: 0.0
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_setting_to_100() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(10)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(1)
                                .cowHealth(100)
                                .build();

                double newCowHealth = 100;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository, userRepository, newCowHealth);
                setCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 100
                                User: Chris Gaucho, numCows: 1, cowHealth: 10.0
                                 old cow health: 10.0, new cow health: 100.0
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_setting_to_negative_value() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(101)
                                .cowHealth(100)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(101)
                                .cowHealth(100)
                                .build();
                
                double newCowHealth = -50;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(101)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository,
                                userRepository, newCowHealth);
                setCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Cow health can't be negative!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_setting_to_value_greater_than_100() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(50)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(1)
                                .cowHealth(50)
                                .build();

                double newCowHealth = 500;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository,
                                                                      userRepository, newCowHealth);
                setCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Cow health can't be more than 100!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_setting_to_new_values_for_multiple() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons1 = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(5)
                                .cowHealth(30)
                                .build();

                UserCommons origUserCommons2 = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(5)
                                .cowHealth(50)
                                .build();

                UserCommons origUserCommons3 = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(5)
                                .cowHealth(70)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(10)
                                .degradationRate(0.01)
                                .build();

                UserCommons newUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(1L)
                                .commonsId(1L)
                                .totalWealth(300 - testCommons.getCowPrice())
                                .numOfCows(5)
                                .cowHealth(50)
                                .build();

                double newCowHealth = 50;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons1, origUserCommons2, origUserCommons3 };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
                when(userRepository.findById(1L)).thenReturn(Optional.of(user));

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository,
                                                                      userRepository, newCowHealth);
                setCowHealthJob.accept(ctx);

                // Assert

                String expected = """
                                Updating cow health...
                                Commons test commons, degradationRate: 0.01, carryingCapacity: 10
                                User: Chris Gaucho, numCows: 5, cowHealth: 30.0
                                 old cow health: 30.0, new cow health: 50.0
                                User: Chris Gaucho, numCows: 5, cowHealth: 50.0
                                 old cow health: 50.0, new cow health: 50.0
                                User: Chris Gaucho, numCows: 5, cowHealth: 70.0
                                 old cow health: 70.0, new cow health: 50.0
                                Cow health has been updated!""";

                assertEquals(expected, jobStarted.getLog());
                assertEquals(origUserCommons1.getCowHealth(), newUserCommons.getCowHealth());
                assertEquals(origUserCommons2.getCowHealth(), newUserCommons.getCowHealth());
                assertEquals(origUserCommons3.getCowHealth(), newUserCommons.getCowHealth());
        }

        @Test
        void test_throws_exception_when_getting_user_fails() throws Exception {

                // Arrange
                Job jobStarted = Job.builder().build();
                JobContext ctx = new JobContext(null, jobStarted);

                UserCommons origUserCommons = UserCommons
                                .builder()
                                .id(1L)
                                .userId(321L)
                                .commonsId(1L)
                                .totalWealth(300)
                                .numOfCows(1)
                                .cowHealth(10)
                                .build();

                Commons testCommons = Commons
                                .builder()
                                .id(117L)
                                .name("test commons")
                                .cowPrice(10)
                                .milkPrice(2)
                                .startingBalance(300)
                                .startingDate(LocalDateTime.now())
                                .carryingCapacity(100)
                                .degradationRate(0.01)
                                .build();

                double newCowHealth = 50;

                Commons commonsTemp[] = { testCommons };
                UserCommons userCommonsTemp[] = { origUserCommons };
                when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
                when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                                .thenReturn(Arrays.asList(userCommonsTemp));
                when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(10));
                when(userRepository.findById(321L)).thenReturn(Optional.empty());

                // Act
                SetCowHealthJob setCowHealthJob = new SetCowHealthJob(commonsRepository, userCommonsRepository,
                                                                      userRepository, newCowHealth);

                RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
                        // Code under test
                        setCowHealthJob.accept(ctx);
                });

                Assertions.assertEquals("Error calling userRepository.findById(321)", thrown.getMessage());

        }

}